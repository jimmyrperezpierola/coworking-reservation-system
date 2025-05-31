// src/pages/PaymentScreen.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  Heading,
  Divider,
  Button,
} from '@chakra-ui/react';

export default function PaymentScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const reservation = location.state?.reservation;

  if (!reservation) {
    return <Text color="red.500">No se encontró la información de la reserva.</Text>;
  }

  return (
    <Box maxW="600px" mx="auto" mt="8" p="6" borderWidth="1px" borderRadius="lg">
      <Heading mb="4">Pago de Reserva</Heading>
      <Text><strong>Espacio:</strong> {reservation.space?.name}</Text>
      <Text><strong>Método de pago:</strong> {reservation.payment_method}</Text>
      <Text>
        <strong>Fecha:</strong>{' '}
        {new Date(reservation.start_time).toLocaleDateString()}
      </Text>
      <Text>
        <strong>Horario:</strong>{' '}
        {new Date(reservation.start_time).toLocaleTimeString()} -{' '}
        {new Date(reservation.end_time).toLocaleTimeString()}
      </Text>
      <Divider my="4" />
      <Text fontSize="xl"><strong>Total a pagar:</strong> ${reservation.total_cost}</Text>

      {/* Aquí mostrarías el QR o instrucciones para pago en efectivo */}
      {reservation.payment_method === 'QR' ? (
        <Box mt="4">
          <Text>Escanea el siguiente QR para pagar:</Text>
          <img src="/qr-demo.png" alt="Código QR de pago" width="200" />
        </Box>
      ) : (
        <Box mt="4">
          <Text>Preséntate en recepción y paga en efectivo.</Text>
        </Box>
      )}

      <Button mt="6" colorScheme="blue" onClick={() => navigate('/')}>
        Volver al inicio
      </Button>
    </Box>
  );
}
