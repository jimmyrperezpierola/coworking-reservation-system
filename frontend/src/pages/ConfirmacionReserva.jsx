import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Text,
  Spinner,
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  FormLabel,
  Heading,
  useToast,
  Flex,
} from '@chakra-ui/react';

const ConfirmacionReserva = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const reserva = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');

  const handlePayment = () => {
    setIsProcessing(true);

    if (paymentMethod === 'qr') {
      toast({
        title: 'Simulación QR',
        description: 'Simulando escaneo de código QR...',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }

    setTimeout(() => {
      setIsProcessing(false);
      navigate('/exito', {
        state: { ...reserva, paymentMethod },
      });
    }, 4000);
  };

  // Obtener datos de reserva desde localStorage
  let startTime = '';
  let endTime = '';
  try {
    const reservationData = JSON.parse(localStorage.getItem('reservationData'));
    if (reservationData) {
      startTime = reservationData.start_time || '';
      endTime = reservationData.end_time || '';
    }
  } catch (e) {
    // Si hay error en el parseo, dejar los valores vacíos
  }

  const formatShortDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const startTimeShort = formatShortDate(startTime);
  const endTimeShort = formatShortDate(endTime);
  const reservationSpaceName = localStorage.getItem('reservationSpaceName') || '';

  useEffect(() => {
    try {
      const reservationData = JSON.parse(localStorage.getItem('reservationData'));
      if (reservationData && reservationData.payment_method) {
        setPaymentMethod(reservationData.payment_method.toLowerCase());
      }
    } catch (e) {
      // Si hay error, no hacer nada
    }
  }, []);

  return (
    <Flex justify="center" align="center" minH="100vh" bg="gray.50">
      <Box bg="white" p={8} rounded="lg" shadow="md" maxW="md" w="100%">
        <Heading as="h2" size="lg" mb={4} textAlign="center">
          Confirmación de Reserva
        </Heading>

        <Text><strong>Espacio:</strong> {reservationSpaceName}</Text>
        <Text><strong>Fecha Inicio:</strong> {startTimeShort}</Text>
        <Text><strong>Fecha Fin:</strong> {endTimeShort}</Text>

        <FormControl mt={6}>
          <FormLabel>Selecciona el Método de Pago:</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={setPaymentMethod}
          >
            <Stack direction="row">
              <Radio value="efectivo">Efectivo</Radio>
              <Radio value="qr">QR</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <Button
          colorScheme="green"
          mt={8}
          w="100%"
          onClick={handlePayment}
          isDisabled={isProcessing}
        >
          {isProcessing ? <Spinner size="sm" /> : 'Pagar Reserva'}
        </Button>
      </Box>
    </Flex>
  );
};

export default ConfirmacionReserva;