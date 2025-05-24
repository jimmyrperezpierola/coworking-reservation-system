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
  const { user_email, start_time, end_time } = req.body;

  const space = await Space.findByPk(id);
  if (!space) return res.status(404).json({ error: 'Espacio no encontrado' });

  const user = await User.findOne({ where: { email: user_email } });
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

  const overlapping = await Reservation.findOne({
    where: {
      space_id: id,
      [Op.or]: [
        { start_time: { [Op.between]: [start_time, end_time] } },
        { end_time: { [Op.between]: [start_time, end_time] } }
      ]
    }
  });

  if (overlapping) return res.status(409).json({ error: 'Espacio ya reservado en ese horario' });

  const hours = (new Date(end_time) - new Date(start_time)) / 3600000;
  const total_cost = (hours * space.hourly_rate).toFixed(2);

  const reservation = await Reservation.create({
    space_id: id,
    user_id: user.id,
    user_email,
    start_time,
    end_time,
    total_cost,
    status: 'confirmed'
  });

  res.status(201).json({ message: 'Reserva confirmada', reservation, total_cost: `$${total_cost}` });
};
