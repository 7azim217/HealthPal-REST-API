// src/routes/mission.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { listMissions, createMission, requestMission } = require('../controllers/missionController');

const router = express.Router();

// Public
router.get('/', listMissions);

// Protected
router.use(protect);
router.post('/', createMission); // NGO only
router.post('/:id/request', requestMission); // Patient only

module.exports = router;