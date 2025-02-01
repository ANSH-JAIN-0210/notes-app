const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  note_name: { type: String, required: true },
  note_tag: { type: String },
  note_description: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Note', noteSchema);
