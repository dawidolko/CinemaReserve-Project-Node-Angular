const express = require('express');
const { Movie, Screening, Hall } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all movies (public)
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.findAll({ order: [['releaseDate', 'DESC']] });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single movie with screenings (public)
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [{
        model: Screening,
        include: [{ model: Hall }],
        order: [['startTime', 'ASC']],
      }],
    });
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create movie (admin)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update movie (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    await movie.update(req.body);
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE movie (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    await movie.destroy();
    res.json({ message: 'Movie deleted.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
