const Reservation = require('../models/Reservation');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endToday = new Date(today);
  endToday.setHours(23, 59, 59, 999);

  const todayReservations = await Reservation.count({ where: { start_time: { [Op.between]: [today, endToday] } } });
  const totalReservations = await Reservation.count();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlyRevenueResult = await Reservation.findAll({
    where: { start_time: { [Op.gte]: monthStart } },
    attributes: ['total_cost']
  });

  const monthlyRevenue = monthlyRevenueResult.reduce((acc, r) => acc + parseFloat(r.total_cost || 0), 0);

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const weeklyOccupancy = [];

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));

    const count = await Reservation.count({ where: { start_time: { [Op.between]: [start, end] } } });

    weeklyOccupancy.unshift({ day: days[start.getDay()], value: count });
  }

  res.json({
    todayOccupancy: todayReservations,
    totalBookings: totalReservations,
    monthlyRevenue,
    weeklyOccupancy
  });
};

exports.createUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword });
  res.status(201).json(user);
};
