const Note = require('../models/Note');

exports.addNote = async (req, res) => {
    const { countryCode, countryName, text } = req.body;
    const userId = req.user.id;
  
    try {
      const note = await Note.create({ userId, countryCode, countryName, text });
      res.status(201).json(note);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

exports.getNotes = async (req, res) => {
  const userId = req.user.id;
  try {
    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
