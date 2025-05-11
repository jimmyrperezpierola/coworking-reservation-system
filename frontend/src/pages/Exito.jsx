import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper } from '@mui/material';

const Exito = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reserva = location.state || {};

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom color="success.main">
          ¡Reserva Confirmada!
        </Typography>

        <Typography><strong>Tipo de Espacio:</strong> {reserva.tipoEspacio}</Typography>
        <Typography><strong>Fecha y Hora:</strong> {reserva.fecha} {reserva.hora}</Typography>
        <Typography><strong>Número de Personas:</strong> {reserva.personas}</Typography>
        <Typography><strong>Método de Pago:</strong> {reserva.paymentMethod === 'qr' ? 'QR' : 'Efectivo'}</Typography>

        <Button
          sx={{ mt: 3 }}
          variant="outlined"
          fullWidth
          onClick={() => navigate('/')}
        >
          Volver al Inicio
        </Button>
      </Paper>
    </Box>
  );
};

export default Exito;