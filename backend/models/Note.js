const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    countryCode: { type: String, required: true },
    countryName: { type: String, required: true },
    text: { type: String, required: true }
  });
  

module.exports = mongoose.model('Note', noteSchema);
