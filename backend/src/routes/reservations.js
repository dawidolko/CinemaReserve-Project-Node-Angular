const express = require('express');
const { Reservation, Screening, Seat, Movie, Hall } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST create reservation (auth required)
router.post('/', authenticate, async (req, res) => {
  try {
    const { screeningId, seatIds } = req.body;

    if (!screeningId || !seatIds || !seatIds.length) {
      return res.status(400).json({ error: 'screeningId and seatIds are required.' });
    }

    const screening = await Screening.findByPk(screeningId);
    if (!screening) {
      return res.status(404).json({ error: 'Screening not found.' });
    }

    const reservations = [];
    for (const seatId of seatIds) {
      const reservation = await Reservation.create({
        userId: req.user.id,
        screeningId,
        seatId,
      });
      reservations.push(reservation);
    }

    res.status(201).json(reservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET my reservations (auth required)
router.get('/my', authenticate, async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Screening,
          include: [{ model: Movie }, { model: Hall }],
        },
        { model: Seat },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH cancel reservation (auth required)
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }
    if (reservation.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized.' });
    }
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ error: 'Already cancelled.' });
    }
    await reservation.update({ status: 'cancelled' });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
