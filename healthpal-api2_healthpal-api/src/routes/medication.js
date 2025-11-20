// src/routes/medication.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  getAvailableItems,
  requestItem,
  fulfillRequest
} = require('../controllers/medicationController');

const router = express.Router();

// Public route
router.get('/available', getAvailableItems);

// Protected routes
router.use(protect);

router.post('/requests', requestItem);
router.put('/requests/:id/fulfill', authorize('ngo', 'admin'), fulfillRequest);

module.exports = router;