const Space = require('../models/Space');
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  const spaces = await Space.findAll({ order: [['name', 'ASC']] });
  res.json(spaces);
};

exports.getEnabled = async (req, res) => {
  const spaces = await Space.findAll({ where: { enabled: true }, order: [['name', 'ASC']] });
  res.json(spaces);
};

exports.getById = async (req, res) => {
  const space = await Space.findByPk(req.params.id);
  if (!space) return res.status(404).json({ error: 'Espacio no encontrado' });
  res.json(space);
};

exports.create = async (req, res) => {
  const space = await Space.create(req.body);
  res.status(201).json(space);
};

exports.update = async (req, res) => {
  const [updated] = await Space.update(req.body, { where: { id: req.params.id } });
  if (!updated) return res.status(404).json({ error: 'Espacio no encontrado' });
  const updatedSpace = await Space.findByPk(req.params.id);
  res.json({ message: 'Espacio actualizado', space: updatedSpace });
};

exports.remove = async (req, res) => {
  const existing = await Reservation.findOne({ where: { space_id: req.params.id } });
  if (existing) return res.status(400).json({ error: 'No se puede eliminar: hay reservas' });
  const deleted = await Space.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ error: 'Espacio no encontrado' });
  res.json({ message: 'Espacio eliminado correctamente' });
};

exports.updateRate = async (req, res) => {
  const { new_hourly_rate } = req.body;
  if (isNaN(new_hourly_rate) || new_hourly_rate <= 0) {
    return res.status(400).json({ error: 'Tarifa inválida' });
  }

  const [updated] = await Space.update({ hourly_rate: new_hourly_rate }, { where: { id: req.params.id } });
  if (!updated) return res.status(404).json({ error: 'Espacio no encontrado' });

  const updatedSpace = await Space.findByPk(req.params.id);
  res.json({ message: 'Tarifa actualizada', space: updatedSpace });
};

exports.reserve = async (req, res) => {
  const { id } = req.params;
  const { user_email, start_time, end_time, total_cost, payment_method } = req.body;

  try {
    const space = await Space.findByPk(id);
    if (!space) return res.status(404).json({ error: 'Espacio no encontrado' });

    const user = await User.findOne({ where: { email: user_email } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const overlapping = await Reservation.findOne({
      where: {
        space_id: id,
        [Op.or]: [
          { start_time: { [Op.between]: [start_time, end_time] } },
          { end_time: { [Op.between]: [start_time, end_time] } },
          {
            start_time: { [Op.lte]: start_time },
            end_time: { [Op.gte]: end_time }
          }
        ]
      }
    });

    if (overlapping) return res.status(409).json({ error: 'Espacio ya reservado en ese horario' });

    const reservation = await Reservation.create({
      space_id: id,
      user_id: user.id,
      user_email,
      start_time,
      end_time,
      total_cost,
      payment_method,
      status: 'confirmed'
    });

    return res.status(201).json({
      message: 'Reserva confirmada',
      reservation,
      total_cost: `$${total_cost}`
    });
  } catch (error) {
    console.error('Error al reservar espacio:', error);
    res.status(500).json({ error: 'Error interno al registrar la reserva' });
  }
};

exports.getAvailability = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  if (!date || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: 'Fecha inválida' });
  }

  try {
    const space = await Space.findByPk(id);
    if (!space) return res.status(404).json({ error: 'Espacio no encontrado' });

    const openingHour = 8;
    const closingHour = 20;
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const reservations = await Reservation.findAll({
      where: {
        space_id: id,
        start_time: { [Op.between]: [startOfDay, endOfDay] }
      },
      order: [['start_time', 'ASC']]
    });

    const slots = [];
    for (let hour = openingHour; hour < closingHour; hour++) {
      const slotStart = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);
      const slotEnd = new Date(`${date}T${(hour + 1).toString().padStart(2, '0')}:00:00`);

      const isAvailable = !reservations.some(res =>
        (slotStart >= res.start_time && slotStart < res.end_time) ||
        (slotEnd > res.start_time && slotEnd <= res.end_time)
      );

      slots.push({ start: slotStart, end: slotEnd, available: isAvailable });
    }

    res.json({ slots });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};


exports.checkAvailability = async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time } = req.query;

  try {
    const overlapping = await Reservation.findOne({
      where: {
        space_id: id,
        [Op.or]: [
          { start_time: { [Op.between]: [start_time, end_time] } },
          { end_time: { [Op.between]: [start_time, end_time] } },
          {
            start_time: { [Op.lte]: start_time },
            end_time: { [Op.gte]: end_time }
          }
        ]
      }
    });

    return res.json({ available: !overlapping });
  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({ error: 'Error al validar disponibilidad' });
  }
};
