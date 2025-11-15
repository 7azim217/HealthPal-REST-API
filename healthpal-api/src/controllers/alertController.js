// src/controllers/alertController.js
/**
 * @swagger
 * tags:
 *   name: HealthAlerts
 *   description: Public health alerts and emergency notifications
 *
 * components:
 *   schemas:
 *     HealthAlert:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - region
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Cholera Outbreak in Gaza"
 *         content:
 *           type: string
 *           example: "Multiple cases reported near water sources. Boil water before use."
 *         region:
 *           type: string
 *           example: "gaza"
 *         severity:
 *           type: string
 *           enum: [low, medium, high]
 *           example: high
 *         created_at:
 *           type: string
 *           format: date-time
 */

const { HealthAlert } = require('../models');

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Get public health alerts (filtered by region)
 *     tags: [HealthAlerts]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by region (e.g., gaza)
 *     responses:
 *       200:
 *         description: List of alerts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 alerts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HealthAlert'
 */
exports.getAlerts = async (req, res) => {
  try {
    const { region } = req.query;
    const where = region ? { region } : {};
    const alerts = await HealthAlert.findAll({
      where,
      order: [['created_at', 'DESC']],
    });
    res.json({ alerts });
  } catch (err) {
    console.error('Fetch alerts error:', err);
    res.status(500).json({ error: 'Failed to fetch health alerts' });
  }
};

/**
 * @swagger
 * /alerts:
 *   post:
 *     summary: Create a new health alert (Admin only)
 *     tags: [HealthAlerts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - region
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Air Quality Alert"
 *               content:
 *                 type: string
 *                 example: "High pollution levels in Ramallah. Avoid outdoor activity."
 *               region:
 *                 type: string
 *                 example: "ramallah"
 *               severity:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *     responses:
 *       201:
 *         description: Alert created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthAlert'
 *       403:
 *         description: Only admins can create alerts
 */
exports.createAlert = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create health alerts' });
    }

    const { title, content, region, severity = 'medium' } = req.body;
    const alert = await HealthAlert.create({ title, content, region, severity });
    res.status(201).json(alert);
  } catch (err) {
    console.error('Create alert error:', err);
    res.status(500).json({ error: 'Failed to create health alert' });
  }
};