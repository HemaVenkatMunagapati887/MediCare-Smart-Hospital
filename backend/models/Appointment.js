const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  timeSlot: {
    type: String,
    required: [true, 'Please add a time slot']
  },
  endTime: {
    type: String // Calculated based on duration
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: [true, 'Please add a reason for appointment']
  },
  notes: String,
  // Smart Scheduling Fields
  visitType: {
    type: String,
    enum: ['First Consultation', 'Follow-up', 'Emergency', 'Routine Checkup', 'Other'],
    default: 'First Consultation'
  },
  duration: {
    type: Number, // Duration in minutes
    default: 30
  },
  noShowProbability: {
    type: Number, // Percentage 0-100
    default: 0
  },
  isOverbooking: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: Date,
  checkedIn: {
    type: Boolean,
    default: false
  },
  checkedInAt: Date,
  actualStartTime: Date,
  actualEndTime: Date,
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  cancelledAt: Date,
  cancellationReason: String,
  bookedVia: {
    type: String,
    enum: ['manual', 'waitlist', 'ai-suggestion'],
    default: 'manual'
  },
  // Telemedicine fields
  consultationType: {
    type: String,
    enum: ['in-person', 'online'],
    default: 'in-person'
  },
  meetingRoomId: {
    type: String
  }
}, {
  timestamps: true
});

// Auto-generate meeting room ID for online consultations
appointmentSchema.pre('save', async function () {
  if (this.consultationType === 'online' && !this.meetingRoomId) {
    this.meetingRoomId = `medicarepro${this._id.toString()}`;
  }
});

// Index for efficient queries
appointmentSchema.index({ doctor: 1, date: 1, status: 1 });
appointmentSchema.index({ patient: 1, status: 1 });

// Index to help prevent double-booking (doctor can't have overlapping appointments on same date)
appointmentSchema.index({ doctor: 1, date: 1, timeSlot: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
