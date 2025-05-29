import { useEffect, useState, useRef } from 'react';
import {
  Box, Text, Spinner, Table, Thead, Tbody, Tr, Th, Td,
  Badge, Alert, AlertIcon, Button, useToast,
  AlertDialog, AlertDialogOverlay, AlertDialogContent,
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from '@chakra-ui/react';

import { useGlobalRefresh } from "../context/useGlobalRefresh";
import { getUserReservations, cancelReservation } from '../../src/services/api'; // Ajusta el path si es necesario

export default function MyBookings() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const cancelRef = useRef();
  const toast = useToast();
  const { refreshToken, triggerGlobalRefresh } = useGlobalRefresh();

  const token = localStorage.getItem('token');

  const fetchReservations = async () => {
    try {
      const data = await getUserReservations(token);
      setReservations(data);
    } catch (err) {
      setError('Error al cargar reservas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [refreshToken, triggerGlobalRefresh]);

  const handleCancel = async (id) => {
    try {
      await cancelReservation(id, token);

      toast({
        title: 'Reserva cancelada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: 'cancelled' } : res
        )
      );
    } catch (err) {
      toast({
        title: 'Error al cancelar la reserva',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.error(err);
    }
  };

  return (
    <Box p={8}>
      <Text fontSize="2xl" mb={4}>Mis Reservas</Text>

      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}

      {loading ? (
        <Spinner size="xl" />
      ) : reservations.length === 0 ? (
        <Text>No tienes reservas aún</Text>
      ) : (
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="gray">
            <Thead>
              <Tr>
                <Th>Espacio</Th>
                <Th>Fecha</Th>
                <Th>Horario</Th>
                <Th>Estado</Th>
                <Th>Costo</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reservations.map((reservation) => (
                <Tr key={reservation.id}>
                  <Td>{reservation.Space?.name || 'Espacio eliminado'}</Td>
                  <Td>{new Date(reservation.start_time).toLocaleDateString()}</Td>
                  <Td>
                    {new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {new Date(reservation.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={
                        reservation.status === 'confirmed'
                          ? 'green'
                          : reservation.status === 'cancelled'
                          ? 'red'
                          : 'orange'
                      }
                    >
                      {reservation.status === 'confirmed'
                        ? 'Confirmada'
                        : reservation.status === 'cancelled'
                        ? 'Cancelada'
                        : 'Pendiente'}
                    </Badge>
                  </Td>
                  <Td>${reservation.total_cost}</Td>
                  <Td>
                    {reservation.status === 'confirmed' && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setReservationToCancel(reservation);
                          setConfirmOpen(true);
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* Confirmación al cancelar */}
      <AlertDialog
        isOpen={confirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setConfirmOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              ¿Cancelar reserva?
            </AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro que deseas cancelar esta reserva? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setConfirmOpen(false)}>
                No
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleCancel(reservationToCancel.id);
                  setConfirmOpen(false);
                }}
                ml={3}
              >
                Sí, cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}

