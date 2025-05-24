const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Importar rutas
const authRoutes = require('./routes/authRoutes');

// Rutas montadas
app.use('/auth', authRoutes); // ✔️ rutas modernas: /auth/login
app.use('/', authRoutes);     // ✔️ compatibilidad: /login, /register

app.use('/users', require('./routes/userRoutes'));
app.use('/spaces', require('./routes/spaceRoutes'));
app.use('/reservations', require('./routes/reservationRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Ruta 404 por defecto
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
