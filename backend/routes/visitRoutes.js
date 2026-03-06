const express = require('express');
const {
  getVisits,
  getVisit,
  createVisit
} = require('../controllers/visitController');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router
  .route('/')
  .get(getVisits)
  .post(authorize('doctor', 'admin'), createVisit);

router.route('/:id').get(getVisit);

module.exports = router;
