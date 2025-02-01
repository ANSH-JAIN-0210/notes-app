const express = require('express');
const Note = require('../models/note');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = '8882345228';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Access Denied: Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid Token', error: err.message });
    }
    req.userId = user.userId;
    next();
  });
};

router.post('/notes', verifyToken, async (req, res) => {
  try {
    const { note_name, note_tag, note_description } = req.body;
    if (!note_name || !note_description) {
      return res.status(400).json({ message: 'Note name and description are required' });
    }

    const newNote = new Note({
      note_name,
      note_tag,
      note_description,
      userId: req.userId,
    });

    await newNote.save();
    res.status(201).json({ message: 'Note Created', note: newNote });
  } catch (err) {
    res.status(500).json({ message: 'Error creating Note', error: err.message });
  }
});

router.put('/notes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { note_name, note_tag, note_description } = req.body;

    if (!note_name || !note_description) {
      return res.status(400).json({ message: 'Note name and description are required' });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, userId: req.userId }, // Ensuring user can only update their own notes
      { note_name, note_tag, note_description },
      { new: true } // Returns updated note
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
  } catch (err) {
    res.status(500).json({ message: 'Error updating note', error: err.message });
  }
});


router.get('/notes', verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes', error: err.message });
  }
});

router.delete('/notes/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, userId: req.userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found or unauthorized' });
    }

    await Note.deleteOne({ _id: id });
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note', error: err.message });
  }
});

module.exports = router;
