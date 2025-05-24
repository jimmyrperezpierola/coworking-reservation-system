import { useState, useEffect } from 'react';
import { SimpleGrid, Box, Button, Text, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../../context/useAuth';
import ReservationModal from './ReservationModal'; // Nuevo componente a crear
import styles from '../../styles/AvailabilityList.module.css';

export default function AvailabilityList() {
  const { token, user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get('http://localhost:5000/spaces', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSpaces(res.data);
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
    fetchSpaces();
  }, [token, toast]);

  const handleReserveClick = (space) => {
    console.log('Espacio seleccionado:', space.id); // 👈 verifica si tiene un .id
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
    await axios.post(
      `http://localhost:5000/spaces/${spaceId}/reserve`,
      {
        user_email: user.email,
        ...reservationData
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
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