const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const user = await User.create({ email, password, firstName, lastName });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email, avatarUrl, password } = req.body;
    const user = req.user;

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'Email already in use.' });
      }
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (password) updateData.password = password;

    await user.update(updateData);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
