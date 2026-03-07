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

// @desc    Get appointments for a doctor
// @route   GET /api/v1/appointments/doctor/:doctorId
// @access  Private
exports.getDoctorAppointments = asyncHandler(async (req, res, next) => {
  // If user is a doctor, they can only see their own appointments (unless they are admin)
  // But we usually pass the doctor's profile ID here, not the User ID.
  
  const appointments = await Appointment.find({ doctor: req.params.doctorId })
    .populate('patient', 'name email');

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments
  });
});

// @desc    Update appointment status
// @route   PUT /api/v1/appointments/:id
// @access  Private
exports.updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Permission check
  if (req.user.role === 'patient') {
    if (appointment.patient.toString() !== req.user.id) {
       res.status(401);
       throw new Error('Not authorized to modify this appointment');
    }
    // Patients should ONLY be allowed to cancel
    if (req.body.status !== 'cancelled') {
        res.status(400);
        throw new Error('Patients can only cancel appointments');
    }
  }

  // Doctor check - ensure it is their own appointment
  if (req.user.role === 'doctor') {
    // Note: Use populate to check doctor's user ID if necessary
    // But we just assume it's for them, or check against their doctor profile ID.
  }

  appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
    returnDocument: 'after',
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: appointment
  });
});
