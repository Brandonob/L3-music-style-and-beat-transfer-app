const express = require('express');
const router = express.Router();
const Music = require('../models/Music');

// GET all music
router.get('/', async (req, res) => {
  try {
    const music = await Music.find();
    res.json(music);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new music
router.post('/', async (req, res) => {
  const music = new Music({
    title: req.body.title,
    artist: req.body.artist,
    genre: req.body.genre
  });

  try {
    const newMusic = await music.save();
    res.status(201).json(newMusic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET single music by id
router.get('/:id', async (req, res) => {
    try {
      const music = await Music.findById(req.params.id);
      if (music) {
        res.json(music);
      } else {
        res.status(404).json({ message: 'Music not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;