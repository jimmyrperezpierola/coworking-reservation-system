import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SimpleGrid,
  Box,
  Button,
  Text,
  Spinner,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useAuth } from '../../context/useAuth';
import { useGlobalRefresh } from '../../context/useGlobalRefresh';
import ReservationModal from './ReservationModal';
import AvailabilityModal from './AvailabilityModal';
import styles from '../../styles/AvailabilityList.module.css';

import { getEnabledSpaces, reserveSpace } from '../../services/api';
import { checkAvailability } from '../../services/api';

export default function AvailabilityList() {
  const { token, user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [availabilitySpace, setAvailabilitySpace] = useState(null);
  const {
    isOpen: isReservationOpen,
    onOpen: openReservation,
    onClose: closeReservation
  } = useDisclosure();
  const {
    isOpen: isAvailabilityOpen,
    onOpen: openAvailability,
    onClose: closeAvailability
  } = useDisclosure();

  const toast = useToast();
  const { refreshToken, triggerGlobalRefresh } = useGlobalRefresh();
  const navigate = useNavigate();

  const fetchSpaces = async () => {
    try {
      const data = await getEnabledSpaces();
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
    openReservation();
  };

const handleReservationSubmit = async (spaceId, reservationData) => {
  const { start_time, end_time } = reservationData;

  const available = await checkAvailability(spaceId, start_time, end_time);
  if (!available) {
    toast({
      title: 'Espacio ocupado',
      description: 'Ya no está disponible en ese horario. Por favor elige otro.',
      status: 'error'
    });
    closeReservation();
    return;
  }

  navigate('/pago', {
    state: {
      reservation: {
        space: selectedSpace,
        ...reservationData
      }
    }
  });
  closeReservation();
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
              colorScheme="green"
              mt="4"
              size="sm"
              mr="2"
              onClick={() => {
                setAvailabilitySpace(space);
                openAvailability();
              }}
            >
              Disponibilidad
            </Button>
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
        isOpen={isReservationOpen}
        onClose={closeReservation}
        space={selectedSpace}
        onSubmit={(reservationData) => handleReservationSubmit(selectedSpace.id, reservationData)}
      />

      <AvailabilityModal
        isOpen={isAvailabilityOpen}
        onClose={closeAvailability}
        space={availabilitySpace}
      />
    </>
  );
}
