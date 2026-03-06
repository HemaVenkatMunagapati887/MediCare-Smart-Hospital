const express = require('express');
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor
} = require('../controllers/doctorController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router
  .route('/')
  .get(getDoctors)
  .post(protect, authorize('admin'), createDoctor);

router
  .route('/:id')
  .get(getDoctor)
  .put(protect, authorize('doctor', 'admin'), updateDoctor);

module.exports = router;
