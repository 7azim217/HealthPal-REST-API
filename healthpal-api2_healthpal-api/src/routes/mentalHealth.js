// src/routes/mentalHealth.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  startAnonymousChat, 
  getChatTranscript,
  sendMessage
} = require('../controllers/mentalHealthController');

const router = express.Router();

router.use(protect);

router.post('/chat', startAnonymousChat);
router.get('/chat/:id', getChatTranscript);
router.post('/chat/:id/message', sendMessage);

module.exports = router;