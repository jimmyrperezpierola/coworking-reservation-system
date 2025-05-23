import { useState, useEffect } from 'react';
import { SimpleGrid, Box, Button, Text, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import { useAuth } from '../../context/useAuth';
import { useGlobalRefresh } from '../../context/useGlobalRefresh';
import ReservationModal from './ReservationModal';
import styles from '../../styles/AvailabilityList.module.css';

import { getEnabledSpaces, reserveSpace } from '../../services/api'; // Ajusta path si es necesario

export default function AvailabilityList() {
  const { token, user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { refreshToken, triggerGlobalRefresh } = useGlobalRefresh();

  const fetchSpaces = async () => {
    try {
      const data = await getEnabledSpaces(token);
      setSpaces(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar espacios');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los espacios',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchSpaces();
  }, [token, toast, refreshToken, triggerGlobalRefresh]);

  const handleReserveClick = (space) => {
    if (!user) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para reservar',
        status: 'warning',
      });
      return;
    }
    setSelectedSpace(space);
    onOpen();
  };

  const handleReservationSubmit = async (spaceId, reservationData) => {
    if (!spaceId) {
      toast({
        title: 'Error interno',
        description: 'ID del espacio no encontrado',
        status: 'error',
      });
      return;
    }

    try {
      await reserveSpace(spaceId, { user_email: user.email, ...reservationData }, token);
      toast({
        title: '¡Reserva exitosa!',
        status: 'success',
      });
      onClose();
    } catch (err) {
      console.error('Error al reservar:', err.response?.data || err.message);
      toast({
        title: 'Error al reservar',
        description: err.response?.data?.error || err.response?.data?.details || err.message,
        status: 'error',
      });
    }
  };

  if (loading) return <Spinner size="xl" thickness="4px" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} spacing="4" className={styles['spaces-list']}>
        {spaces.map(space => (
          <Box key={space.id} className={styles['space-card']}>
            <Text fontWeight="bold" fontSize="lg">{space.name}</Text>
            <Text mt="2">Capacidad: {space.capacity}</Text>
            <Text>Precio: ${space.hourly_rate}/h</Text>
            <Button 
              colorScheme="blue" 
              mt="4" 
              size="sm"
              onClick={() => handleReserveClick(space)}
            >
              Reservar
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      <ReservationModal
        isOpen={isOpen}
        onClose={onClose}
        space={selectedSpace}
        onSubmit={(reservationData) => handleReservationSubmit(selectedSpace.id, reservationData)}
      />
    </>
  );
}
