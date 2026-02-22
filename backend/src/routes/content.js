const express = require('express');
const { SiteContent, SectionOrder } = require('../models');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all content (public)
router.get('/', async (req, res) => {
  try {
    const contents = await SiteContent.findAll();
    const map = {};
    contents.forEach(c => { map[c.sectionKey] = c.content; });
    res.json(map);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update content by key (admin)
router.put('/:key', authenticate, requireAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    const [item, created] = await SiteContent.findOrCreate({
      where: { sectionKey: req.params.key },
      defaults: { content, type: 'text' },
    });
    if (!created) {
      await item.update({ content });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET sections order (public)
router.get('/sections', async (req, res) => {
  try {
    const sections = await SectionOrder.findAll({ order: [['position', 'ASC']] });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update sections (admin) - accepts array of { id, position, isVisible }
router.put('/sections', authenticate, requireAdmin, async (req, res) => {
  try {
    const updates = req.body;
    for (const item of updates) {
      await SectionOrder.update(
        { position: item.position, isVisible: item.isVisible, title: item.title },
        { where: { id: item.id } }
      );
    }
    const sections = await SectionOrder.findAll({ order: [['position', 'ASC']] });
    res.json(sections);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
