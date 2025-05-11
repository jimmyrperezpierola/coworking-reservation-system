import React from 'react';
import { Card, Typography, List, ListItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Confirmacion() {
  const reserva = JSON.parse(localStorage.getItem('reserva'));
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5">Detalles de la Reserva</Typography>
      <List>
        <ListItem>Tipo de Espacio: {reserva.tipoEspacio}</ListItem>
        <ListItem>Fecha y Hora: {new Date(reserva.fecha).toLocaleString()}</ListItem>
        <ListItem>Número de Personas: {reserva.numPersonas}</ListItem>
        <ListItem>Método de Pago: {reserva.metodoPago}</ListItem>
      </List>
      <Button variant="contained" color="success" fullWidth onClick={() => navigate('/exito')}>
        Pagar Ahora
      </Button>
    </Card>
  );
}