const express = require('express');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { getAlerts, createAlert } = require('../controllers/alertController');

const router = express.Router();

router.get('/', getAlerts); 
router.use(protect);
router.post('/', authorize('admin'), createAlert);

module.exports = router;