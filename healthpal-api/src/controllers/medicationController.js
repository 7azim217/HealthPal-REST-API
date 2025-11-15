/**
 * @swagger
 * tags:
 *   name: Medications
 *   description: Medicine & equipment coordination system
 *
 * components:
 *   schemas:
 *     Medication:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - provider_type
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Insulin Vials"
 *         description:
 *           type: string
 *         quantity:
 *           type: integer
 *           example: 50
 *         category:
 *           type: string
 *           enum: [medicine, equipment]
 *         provider_type:
 *           type: string
 *           enum: [pharmacy, ngo, donor]
 *         provider_id:
 *           type: integer
 *     Request:
 *       type: object
 *       required:
 *         - medication_id
 *       properties:
 *         id:
 *           type: integer
 *         requester_id:
 *           type: integer
 *         medication_id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [pending, fulfilled, cancelled]
 *         delivery_address:
 *           type: string
 */

const { Medication, Request, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * /medications/available:
 *   get:
 *     summary: List all available medicines and equipment
 *     tags: [Medications]
 *     responses:
 *       200:
 *         description: List of available items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Medication'
 */
exports.getAvailableItems = async (req, res) => {
  try {
    const items = await Medication.findAll({
      where: { quantity: { [Op.gt]: 0 } },
      order: [['created_at', 'DESC']],
    });
    res.json({ items });
  } catch (err) {
    console.error('Fetch items error:', err);
    res.status(500).json({ error: 'Failed to fetch available items' });
  }
};

/**
 * @swagger
 * /medications/requests:
 *   post:
 *     summary: Request a medicine or equipment (Any user)
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medication_id
 *             properties:
 *               medication_id:
 *                 type: integer
 *                 example: 1
 *               delivery_address:
 *                 type: string
 *                 example: "Gaza City, Al-Rimal, near Al-Shifa Hospital"
 *     responses:
 *       201:
 *         description: Request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid medication or out of stock
 *       401:
 *         description: Authentication required
 */
exports.requestItem = async (req, res) => {
  try {
    const { medication_id, delivery_address } = req.body;
    const requester_id = req.user.id;

    const medication = await Medication.findByPk(medication_id);
    if (!medication) {
      return res.status(400).json({ error: 'Medication not found' });
    }
    if (medication.quantity <= 0) {
      return res.status(400).json({ error: 'Item is out of stock' });
    }

    const request = await Request.create({
      requester_id,
      medication_id,
      delivery_address,
    });

    res.status(201).json({ message: 'Request submitted', request });
  } catch (err) {
    console.error('Request item error:', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
};

/**
 * @swagger
 * /medications/requests/{id}/fulfill:
 *   put:
 *     summary: Fulfill a request (NGO or Admin only)
 *     tags: [Medications]
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
 *         description: Request fulfilled
 *       403:
 *         description: Only NGOs or admins can fulfill requests
 *       404:
 *         description: Request not found
 */
exports.fulfillRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role !== 'ngo' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Only NGOs or admins can fulfill requests' });
    }

    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const medication = await Medication.findByPk(request.medication_id);
    if (medication.quantity <= 0) {
      return res.status(400).json({ error: 'Item no longer available' });
    }

    // Reduce stock
    medication.quantity -= 1;
    await medication.save();

    // Mark request as fulfilled
    request.status = 'fulfilled';
    await request.save();

    res.json({ message: 'Request fulfilled successfully' });
  } catch (err) {
    console.error('Fulfill request error:', err);
    res.status(500).json({ error: 'Failed to fulfill request' });
  }
};