const Visit = require('../models/Visit');
const Doctor = require('../models/Doctor');
const asyncHandler = require('express-async-handler');

// @desc    Get all visits/medical records
// @route   GET /api/v1/visits
// @access  Private
exports.getVisits = asyncHandler(async (req, res, next) => {
  let query;

  if (req.user.role === 'patient') {
    query = Visit.find({ patient: req.user.id });
  } else if (req.user.role === 'doctor') {
    // Find the doctor's profile first to get the Doctor document _id
    const doctorProfile = await Doctor.findOne({ user: req.user.id });
    if (!doctorProfile) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }
    query = Visit.find({ doctor: doctorProfile._id });
  } else {
    query = Visit.find();
  }

  const visits = await query
    .populate('patient', 'name email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email' }
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: visits.length,
    data: visits
  });
});

// @desc    Create a visit/medical record
// @route   POST /api/v1/visits
// @access  Private/Doctor
exports.createVisit = asyncHandler(async (req, res, next) => {
  // Find the doctor's profile to get the proper Doctor document ID
  const doctorProfile = await Doctor.findOne({ user: req.user.id });
  
  if (!doctorProfile) {
    res.status(404);
    throw new Error('Doctor profile not found. Please complete your profile setup.');
  }

  req.body.doctor = doctorProfile._id;

  const visit = await Visit.create(req.body);

  // Populate before returning so the response is useful
  const populatedVisit = await Visit.findById(visit._id)
    .populate('patient', 'name email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email' }
    });

  res.status(201).json({
    success: true,
    data: populatedVisit
  });
});

// @desc    Get single visit
// @route   GET /api/v1/visits/:id
// @access  Private
exports.getVisit = asyncHandler(async (req, res, next) => {
  const visit = await Visit.findById(req.params.id)
    .populate('patient', 'name email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email' }
    });

  if (!visit) {
    res.status(404);
    throw new Error('Visit record not found');
  }

  res.status(200).json({
    success: true,
    data: visit
  });
});

// @desc    Get visits for a specific patient (by patient ID)
// @route   GET /api/v1/visits/patient/:patientId
// @access  Private (Doctor/Admin)
exports.getPatientVisits = asyncHandler(async (req, res, next) => {
  const visits = await Visit.find({ patient: req.params.patientId })
    .populate('patient', 'name email')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email' }
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: visits.length,
    data: visits
  });
});
