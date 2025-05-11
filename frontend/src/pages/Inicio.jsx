import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <Container sx={{ mt: 8, textAlign: 'center' }}>
      <img src="/src/assets/logo1.png" alt="Logo" style={{ width: '200px', marginBottom: '20px' }} />
      <Typography variant="h3" gutterBottom>
        Reserva tu espacio de coworking
      </Typography>
      <div style={{ marginTop: '20px' }} /> 
      <Button variant="contained" size="large" component={Link} to="/espacios">
        Ver Espacios
      </Button>
    </Container>
  );
}