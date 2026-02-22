const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { User, Movie, Screening, Reservation, Seat, Hall } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireAdmin);

// GET dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalMovies, totalUsers, todayScreenings, todayReservations, totalRevenue] = await Promise.all([
      Movie.count(),
      User.count(),
      Screening.count({ where: { startTime: { [Op.gte]: today, [Op.lt]: tomorrow } } }),
      Reservation.count({ where: { createdAt: { [Op.gte]: today, [Op.lt]: tomorrow }, status: 'confirmed' } }),
      Reservation.count({ where: { status: 'confirmed' } }),
    ]);

    // Calculate revenue from confirmed reservations
    const revenueResult = await Reservation.findAll({
      where: { status: 'confirmed' },
      include: [{ model: Screening, attributes: ['price'] }],
      attributes: [],
      raw: true,
    });
    const revenue = revenueResult.reduce((sum, r) => sum + parseFloat(r['Screening.price'] || 0), 0);

    res.json({
      totalMovies,
      totalUsers,
      todayScreenings,
      todayReservations,
      totalRevenue: revenue,
      totalReservations: totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all reservations
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: User, attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: Screening, include: [{ model: Movie }, { model: Hall }] },
        { model: Seat },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT change user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    await user.update({ role: req.body.role });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
