const express = require('express');
const {
  getAppointments,
  getPatientAppointments,
  bookAppointment,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect); // All appointment routes are protected

router
  .route('/')
  .get(authorize('admin'), getAppointments)
  .post(authorize('patient'), bookAppointment);

router.get('/patient/:patientId', getPatientAppointments);

router.put('/:id', authorize('doctor', 'admin'), updateAppointmentStatus);

module.exports = router;
