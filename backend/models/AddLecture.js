const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
  teacher: String,
  venue: String,
  class: String,
  time: String,
  strength: String,
  resourcePerson: String,
  company: String,
  location: String,
  designation: String,
  topic: String,
  images: String,
  banner: String,
  date: Date,   // <-- Store date here
});

module.exports = mongoose.model('Lecture', lectureSchema);
