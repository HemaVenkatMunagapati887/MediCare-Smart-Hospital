const Visit = require('../models/Visit');
const asyncHandler = require('express-async-handler');

// @desc    Get all visits/medical records
// @route   GET /api/v1/visits
// @access  Private
exports.getVisits = asyncHandler(async (req, res, next) => {
  let query;

  if (req.user.role === 'patient') {
    query = Visit.find({ patient: req.user.id });
  } else if (req.user.role === 'doctor') {
    query = Visit.find({ doctor: req.user.id });
  } else {
    query = Visit.find();
  }

  const visits = await query.populate('patient', 'name').populate('doctor', 'name');

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
  req.body.doctor = req.user.id;

  const visit = await Visit.create(req.body);

  res.status(201).json({
    success: true,
    data: visit
  });
});

// @desc    Get single visit
// @route   GET /api/v1/visits/:id
// @access  Private
exports.getVisit = asyncHandler(async (req, res, next) => {
  const visit = await Visit.findById(req.params.id);

  if (!visit) {
    res.status(404);
    throw new Error('Visit record not found');
  }

  res.status(200).json({
    success: true,
    data: visit
  });
});
