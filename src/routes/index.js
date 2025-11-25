const express = require('express');
const authRoutes = require('./auth');
const consultationRoutes = require('./consultation');
const treatmentRoutes = require('./treatment');
const medicationRoutes = require('./medication');
const alertRoutes = require('./alert');
const mentalHealthRoutes = require('./mentalHealth');
const missionRoutes = require('./mission'); 

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to HealthPal API!' });
});

router.use('/auth', authRoutes);
router.use('/consultations', consultationRoutes);
router.use('/treatments', treatmentRoutes);
router.use('/medications', medicationRoutes);
router.use('/alerts', alertRoutes);
router.use('/mental-health', mentalHealthRoutes);
router.use('/missions', missionRoutes); 

module.exports = router;