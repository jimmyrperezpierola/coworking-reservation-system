const Reservation = require('../models/Reservation');
const Space = require('../models/Space');
const User = require('../models/User');

exports.getAll = async (req, res) => {
  try {
    const where = req.user.isAdmin ? {} : { user_id: req.user.id };

    const reservations = await Reservation.findAll({
      where,
      include: [Space]
    });

    res.json(reservations);
  } catch (err) {
    console.error('❌ Error al obtener reservas:', err);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

exports.create = async (req, res) => {
  const { space_id, user_email, start_time, end_time } = req.body;
  const user = await User.findOne({ where: { email: user_email } });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const reservation = await Reservation.create({
    space_id,
    user_id: user.id,
    user_email,
    start_time,
    end_time,
    status: 'confirmed'
  });

  res.status(201).json(reservation);
};

exports.cancel = async (req, res) => {
  const reservation = await Reservation.findByPk(req.params.id);
  if (!reservation) return res.status(404).json({ error: 'Reserva no encontrada' });

  reservation.status = 'cancelled';
  await reservation.save();

  res.json({ success: true, reservation });
};
