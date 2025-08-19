const mongoose = require('mongoose');

const LectureRequestSchema = new mongoose.Schema({
  studentRollNumber: { type: String, required: true },
  type: { type: String, enum: ['add', 'edit', 'other'], default: 'add' },
  lectureTitle: { type: String, required: true },
  lectureDate: { type: Date, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminComments: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

LectureRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('LectureRequest', LectureRequestSchema);
