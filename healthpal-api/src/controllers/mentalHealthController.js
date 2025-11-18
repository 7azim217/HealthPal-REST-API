/**
 * @swagger
 * tags:
 *   name: MentalHealth
 *   description: Trauma counseling, anonymous chat, and support groups
 *
 * components:
 *   schemas:
 *     TherapyChat:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 3
 *         is_anonymous:
 *           type: boolean
 *           example: true
 *         topic:
 *           type: string
 *           example: "PTSD from bombing"
 *         status:
 *           type: string
 *           enum: [active, closed]
 *         created_at:
 *           type: string
 *           format: date-time
 *     ChatMessage:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         content:
 *           type: string
 *         sender_role:
 *           type: string
 *           enum: [user, counselor]
 *         created_at:
 *           type: string
 *           format: date-time
 */

const { TherapyChat, ChatMessage } = require('../models');

/**
 * @swagger
 * /mental-health/chat:
 *   post:
 *     summary: Start an anonymous therapy chat session
 *     tags: [MentalHealth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "PTSD from bombing"
 *     responses:
 *       201:
 *         description: Chat session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TherapyChat'
 */
exports.startAnonymousChat = async (req, res) => {
  try {
    const { topic } = req.body;
    const user_id = req.user.id;

    const chat = await TherapyChat.create({
      user_id,
      topic,
      is_anonymous: true,
    });

    res.status(201).json(chat);
  } catch (err) {
    console.error('Start chat error:', err);
    res.status(500).json({ error: 'Failed to start chat session' });
  }
};

/**
 * @swagger
 * /mental-health/chat/{id}:
 *   get:
 *     summary: Get full chat transcript (user or counselor only)
 *     tags: [MentalHealth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chat:
 *                   $ref: '#/components/schemas/TherapyChat'
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChatMessage'
 *       403:
 *         description: Not authorized to view this chat
 */
exports.getChatTranscript = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const chat = await TherapyChat.findByPk(id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.user_id !== userId && role !== 'doctor') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = await ChatMessage.findAll({
      where: { chat_id: id },
      attributes: ['id', 'content', 'sender_role', 'created_at'],
      order: [['created_at', 'ASC']],
    });

    res.json({ chat, messages });
  } catch (err) {
    console.error('Get chat error:', err);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

/**
 * @swagger
 * /mental-health/chat/{id}/message:
 *   post:
 *     summary: Send a message in a therapy chat
 *     tags: [MentalHealth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "I've been having nightmares since the bombing."
 *     responses:
 *       201:
 *         description: Message sent
 *       403:
 *         description: Not authorized to send message in this chat
 */
exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!content?.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const chat = await TherapyChat.findByPk(id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const isChatOwner = chat.user_id === userId;
    const isDoctor = userRole === 'doctor';

    if (!isChatOwner && !isDoctor) {
      return res.status(403).json({ error: 'Not authorized to send messages in this chat' });
    }

    const senderRole = isDoctor ? 'counselor' : 'user';

    const message = await ChatMessage.create({
      chat_id: id,
      sender_id: userId,
      sender_role: senderRole,
      content: content.trim(),
      is_anonymous: true,
    });

    res.status(201).json({ message: 'Message sent', messageId: message.id });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};