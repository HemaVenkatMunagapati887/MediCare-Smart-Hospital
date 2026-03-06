const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const asyncHandler = require('express-async-handler');

// @desc    Get all appointments
// @route   GET /api/v1/appointments
// @access  Private (Admin)
exports.getAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate('patient', 'name email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name' }
    });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

// @desc    Get appointments for a patient
// @route   GET /api/v1/appointments/patient/:patientId
// @access  Private
exports.getPatientAppointments = asyncHandler(async (req, res, next) => {
  if (req.user.role === 'patient' && req.user.id !== req.params.patientId) {
    res.status(401);
    throw new Error('Not authorized to see others appointments');
  }

  const appointments = await Appointment.find({ patient: req.params.patientId })
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name' }
    });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

// @desc    Book appointment
// @route   POST /api/v1/appointments
// @access  Private
exports.bookAppointment = asyncHandler(async (req, res, next) => {
  req.body.patient = req.user.id;

  const doctor = await Doctor.findById(req.body.doctor);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  const appointment = await Appointment.create(req.body);

  res.status(201).json({
    success: true,
    data: appointment
  });
});

// @desc    Update appointment status
// @route   PUT /api/v1/appointments/:id
// @access  Private (Doctor/Admin)
exports.updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: appointment
  });
});
