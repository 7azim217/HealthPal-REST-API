const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  bookConsultation,
  getMyConsultations,
  updateConsultationStatus
} = require('../controllers/consultationController');

const router = express.Router();

router.use(protect);

router.post('/', authorize('patient'), bookConsultation);
router.get('/', getMyConsultations);
router.put('/:id/status', updateConsultationStatus);

module.exports = router;