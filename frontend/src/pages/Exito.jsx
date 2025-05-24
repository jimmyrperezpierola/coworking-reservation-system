import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Text,
  Heading,
  Stack,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';

const Exito = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reserva = location.state || {};

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  // Recuperar datos de localStorage
  const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');

  // Función para formatear fecha y hora
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.800')}>
      <Box
        bg={cardBg}
        boxShadow={cardShadow}
        p={8}
        rounded="lg"
        maxW="md"
        w="100%"
      >
        <Heading as="h2" size="lg" mb={4} color="green.500" textAlign="center">
          ¡Reserva Confirmada!
        </Heading>

        <Stack spacing={3} mb={6}>
          <Text>
            <strong>Espacio:</strong> {localStorage.getItem('reservationSpaceName') || reserva.tipoEspacio}
          </Text>
          <Text>
            <strong>Fecha Inicio:</strong> {formatDateTime(reservationData.start_time)}
          </Text>
          <Text>
            <strong>Fecha Fin:</strong> {formatDateTime(reservationData.end_time)}
          </Text>
          <Text>
            <strong>Método de Pago:</strong> {reservationData.payment_method === 'QR' ? 'QR' : reservationData.payment_method === 'Efectivo' ? 'Efectivo' : ''}
          </Text>
        </Stack>

        <Button
          variant="outline"
          colorScheme="green"
          width="100%"
          onClick={() => navigate('/dashboard')}
        >
          Volver al Inicio
        </Button>
      </Box>
    </Flex>
  );
};

export default Exito;