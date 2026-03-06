const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add specialization']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  fees: {
    type: Number,
    required: [true, 'Please add consultation fees']
  },
  about: {
    type: String,
    maxlength: [500, 'About cannot be more than 500 characters']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  availability: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  ratings: {
    type: Number,
    default: 4.5
  },
  totalPatients: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
