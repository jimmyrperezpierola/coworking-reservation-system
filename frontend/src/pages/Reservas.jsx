import React, { useState } from 'react';
import {
  Card, Typography, FormControl, InputLabel, Select, MenuItem,
  TextField, Button, RadioGroup, FormControlLabel, Radio, FormLabel
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';

export default function Reservas() {
  const [tipoEspacio, setTipoEspacio] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [numPersonas, setNumPersonas] = useState(1);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const navigate = useNavigate();

const handleConfirmar = () => {
    const reserva = {
        tipoEspacio,
        fecha: fecha.toISOString(), // Convierte la fecha a un formato serializable
        personas: numPersonas,
        metodoPago,
    };
    localStorage.setItem('reserva', JSON.stringify(reserva)); // Opcional, para persistencia
    navigate('/confirmacion', { state: reserva });
};

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>Formulario de Reserva</Typography>

      <FormControl fullWidth sx={{ mt: 2, pb: 3 }}>
        <InputLabel>Tipo de Espacio</InputLabel>
        <Select value={tipoEspacio} onChange={e => setTipoEspacio(e.target.value)}>
          <MenuItem value="Sala de Reunión">Sala de Reunión</MenuItem>
          <MenuItem value="Escritorio">Escritorio</MenuItem>
        </Select>
      </FormControl>
      
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Fecha y Hora"
          value={fecha}
          onChange={setFecha}
          renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
        />
      </LocalizationProvider>

      <TextField
        label="Número de Personas"
        type="number"
        fullWidth
        sx={{ mt: 2 }}
        value={numPersonas}
        onChange={e => setNumPersonas(Number(e.target.value))}
      />

      <FormLabel component="legend" sx={{ mt: 2 }}>Método de Pago</FormLabel>
      <RadioGroup row value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
        <FormControlLabel value="Efectivo" control={<Radio />} label="Efectivo" />
        <FormControlLabel value="QR" control={<Radio />} label="QR" />
      </RadioGroup>

      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleConfirmar}>
        Reservar
      </Button>
    </Card>
  );
}