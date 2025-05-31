import { useEffect, useState } from 'react';
import { 
  Heading, Box, Text, VStack, Button,
  Table, Thead, Tbody, Tr, Th, Td, 
  Badge, Spinner, Alert, AlertIcon
} from '@chakra-ui/react';
import { useAuth } from '../context/useAuth';
import { getUserReservations } from '../../src/services/api'; // Asegúrate de que el path sea correcto

export default function Profile() {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token'); // O usa desde contexto si prefieres
        const data = await getUserReservations(token);
        setReservations(data);
      } catch (err) {
        setError('Error al cargar reservas');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <Box p={8} maxW="800px" mx="auto">
      <Heading mb={6}>Mi Perfil</Heading>
      <VStack align="start" spacing={4} mb={8}>
        <Text><strong>Email:</strong> {user?.email}</Text>
        <Text><strong>Rol:</strong> {user?.isAdmin ? 'Administrador' : 'Usuario'}</Text>
        <Button colorScheme="red" mt={4} onClick={logout}>
          Cerrar sesión
        </Button>
      </VStack>

      <Heading size="md" mb={4}>Mis Reservas</Heading>

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
              </Tr>
            </Thead>
            <Tbody>
              {reservations.map((reservation) => (
                <Tr key={reservation.id}>
                  <Td>{reservation.Space?.name || 'Espacio eliminado'}</Td>
                  <Td>{new Date(reservation.start_time).toLocaleDateString()}</Td>
                  <Td>
                    {new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
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
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </Box>
  );
}
