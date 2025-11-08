// src/routes/treatment.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  createTreatment,
  getTreatments,
  donate,
  getTransparencyReport
} = require('../controllers/treatmentController');

const router = express.Router();

// Public routes
router.get('/', getTreatments);
router.get('/:id/transparency', getTransparencyReport);

// Protected routes
router.use(protect);

router.post('/', authorize('patient'), createTreatment);
router.post('/donations', authorize('donor'), donate);

module.exports = router;