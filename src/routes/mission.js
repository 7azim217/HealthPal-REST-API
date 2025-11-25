const express = require('express');
const { protect } = require('../middleware/auth');
const { listMissions, createMission, requestMission } = require('../controllers/missionController');

const router = express.Router();

router.get('/', listMissions);

router.use(protect);
router.post('/', createMission); 
router.post('/:id/request', requestMission); 

module.exports = router;