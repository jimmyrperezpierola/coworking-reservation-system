import {
  Box,
  Button,
  Text,
  Heading,
  Stack,
  RadioGroup,
  Radio,
  useToast,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { reserveSpace } from '../services/api';
import { useAuth } from '../context/useAuth';

export default function PagoReserva() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const data = location.state?.reservation;
  const [paymentMethod, setPaymentMethod] = useState("Efectivo"); // 👈 ESTA ES LA CLAVE

  if (!data || !user) {
    return <Text>No hay datos válidos para procesar la reserva.</Text>;
  }

const handleFinalizar = async () => {
  try {
    await reserveSpace(data.space.id, {
      user_email: user.email,
      start_time: data.start_time,
      end_time: data.end_time,
      total_cost: data.total_cost,
      payment_method: paymentMethod
    });

    localStorage.setItem("reservationData", JSON.stringify({
      ...data,
      payment_method: paymentMethod
    }));
    localStorage.setItem("reservationSpaceName", data.space.name);

    navigate("/exito");
  } catch (err) {
    toast({
      title: "Error al registrar reserva",
      description: err.response?.data?.error || err.message,
      status: "error"
    });
  }
};


  return (
    <Box maxW="600px" mx="auto" mt="8" p="6" borderWidth="1px" borderRadius="lg">
      <Heading mb="4">Pago de Reserva</Heading>

      <Stack spacing={3} mb={6}>
        <Text><strong>Espacio:</strong> {data.space.name}</Text>
        <Text><strong>Fecha Inicio:</strong> {new Date(data.start_time).toLocaleString()}</Text>
        <Text><strong>Fecha Fin:</strong> {new Date(data.end_time).toLocaleString()}</Text>
        <Text><strong>Total a pagar:</strong> ${data.total_cost}</Text>

        <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
          <Stack direction="row">
            <Radio value="Efectivo">Efectivo</Radio>
            <Radio value="QR">QR</Radio>
          </Stack>
        </RadioGroup>

        {paymentMethod === 'QR' && (
          <Box mt={3}>
            <Text>Escanea el siguiente QR para pagar:</Text>
            <img src="/qr-demo.png" alt="QR de pago" width={200} />
          </Box>
        )}
      </Stack>

      <Stack direction="row" justify="space-between">
        <Button variant="outline" onClick={() => navigate('/')}>
          Cancelar
        </Button>
        <Button colorScheme="green" onClick={handleFinalizar}>
          Finalizar
        </Button>
      </Stack>
    </Box>
  );
}
