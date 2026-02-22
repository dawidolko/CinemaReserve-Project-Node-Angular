const express = require('express');
const { Op } = require('sequelize');
const { Screening, Movie, Hall, Seat, Reservation } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET screenings (public) - filter by movieId and/or date
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.movieId) {
      where.movieId = req.query.movieId;
    }
    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.startTime = { [Op.gte]: date, [Op.lt]: nextDay };
    }

    const screenings = await Screening.findAll({
      where,
      include: [
        { model: Movie },
        { model: Hall },
      ],
      order: [['startTime', 'ASC']],
    });
    res.json(screenings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET screening detail with taken seats (public)
router.get('/:id', async (req, res) => {
  try {
    const screening = await Screening.findByPk(req.params.id, {
      include: [
        { model: Movie },
        { model: Hall, include: [{ model: Seat }] },
        {
          model: Reservation,
          where: { status: 'confirmed' },
          required: false,
          include: [{ model: Seat }],
        },
      ],
    });
    if (!screening) {
      return res.status(404).json({ error: 'Screening not found.' });
    }

    const takenSeatIds = screening.Reservations.map(r => r.seatId);

    res.json({
      ...screening.toJSON(),
      takenSeatIds,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create screening (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const screening = await Screening.create(req.body);
    const full = await Screening.findByPk(screening.id, {
      include: [{ model: Movie }, { model: Hall }],
    });
    res.status(201).json(full);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update screening (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const screening = await Screening.findByPk(req.params.id);
    if (!screening) {
      return res.status(404).json({ error: 'Screening not found.' });
    }
    await screening.update(req.body);
    const full = await Screening.findByPk(screening.id, {
      include: [{ model: Movie }, { model: Hall }],
    });
    res.json(full);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE screening (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const screening = await Screening.findByPk(req.params.id);
    if (!screening) {
      return res.status(404).json({ error: 'Screening not found.' });
    }
    await screening.destroy();
    res.json({ message: 'Screening deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
