import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Paper,
} from '@mui/material';

const ConfirmacionReserva = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reserva = location.state || {}; // datos pasados desde pantalla de reserva

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');

  const handlePayment = () => {
    setIsProcessing(true);

    if (paymentMethod === 'qr') {
      alert('Simulando escaneo de código QR...');
    }

    setTimeout(() => {
      setIsProcessing(false);
      navigate('/exito', {
        state: { ...reserva, paymentMethod },
      });
    }, 4000);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Confirmación de Reserva
        </Typography>

        <Typography><strong>Tipo de Espacio:</strong> {reserva.tipoEspacio}</Typography>
        <Typography><strong>Fecha y Hora:</strong> {reserva.fecha} {reserva.hora}</Typography>
        <Typography><strong>Número de Personas:</strong> {reserva.personas}</Typography>

        <Box sx={{ mt: 3 }}>
          <FormLabel>Selecciona el Método de Pago:</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel value="efectivo" control={<Radio />} label="Efectivo" />
            <FormControlLabel value="qr" control={<Radio />} label="QR" />
          </RadioGroup>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? <CircularProgress size={24} /> : 'Pagar Ahora'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConfirmacionReserva;
