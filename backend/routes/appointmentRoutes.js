const express = require('express');
const {
  getAppointments,
  getPatientAppointments,
  getDoctorAppointments,
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

router.get('/patient/:patientId', authorize('patient', 'doctor', 'admin'), getPatientAppointments);
router.get('/doctor/:doctorId', authorize('doctor', 'admin'), getDoctorAppointments);

router.put('/:id', authorize('patient', 'doctor', 'admin'), updateAppointmentStatus);

module.exports = router;
