const express = require('express');
const { Hall, Seat } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all halls (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const halls = await Hall.findAll({
      include: [{ model: Seat }],
      order: [['name', 'ASC']],
    });
    res.json(halls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single hall
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id, {
      include: [{ model: Seat }],
    });
    if (!hall) {
      return res.status(404).json({ error: 'Hall not found.' });
    }
    res.json(hall);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create hall + auto-generate seats (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, rows, seatsPerRow, vipRows } = req.body;
    const hall = await Hall.create({ name, rows, seatsPerRow });

    const seats = [];
    const vipRowNumbers = vipRows || [];
    for (let row = 1; row <= rows; row++) {
      for (let num = 1; num <= seatsPerRow; num++) {
        seats.push({
          hallId: hall.id,
          row,
          number: num,
          seatType: vipRowNumbers.includes(row) ? 'vip' : 'standard',
        });
      }
    }
    await Seat.bulkCreate(seats);

    const full = await Hall.findByPk(hall.id, { include: [{ model: Seat }] });
    res.status(201).json(full);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE hall (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall) {
      return res.status(404).json({ error: 'Hall not found.' });
    }
    await hall.destroy();
    res.json({ message: 'Hall deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
