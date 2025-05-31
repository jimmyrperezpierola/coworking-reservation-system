// frontend/src/components/Payment/PaymentScreen.jsx

import React from 'react';

const PaymentScreen = ({ reservation }) => {
  return (
    <div>
      <h2>Pago de Reserva</h2>
      <p>Espacio: {reservation.space.name}</p>
      <p>Fecha: {new Date(reservation.start_time).toLocaleDateString()}</p>
      <p>Hora: {new Date(reservation.start_time).toLocaleTimeString()} - {new Date(reservation.end_time).toLocaleTimeString()}</p>
      <p><strong>Total a pagar: ${reservation.total_cost}</strong></p>
      {/* Aquí va el código QR o la opción de pago en efectivo */}
    </div>
  );
};

export default PaymentScreen;
