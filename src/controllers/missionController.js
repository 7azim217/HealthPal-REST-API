/**
 * @swagger
 * tags:
 *   name: MedicalMissions
 *   description: NGO medical missions and volunteer scheduling
 *
 * components:
 *   schemas:
 *     MedicalMission:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - ngo_id
 *         - location
 *         - start_date
 *         - end_date
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *           example: "Pediatric Surgery Camp - Gaza"
 *         location:
 *           type: string
 *           example: "Al-Shifa Hospital, Gaza City"
 *         start_date:
 *           type: string
 *           format: date
 *         end_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [upcoming, active, completed]
 */

const { MedicalMission, MissionRequest } = require('../models');

/**
 * @swagger
 * /missions:
 *   get:
 *     summary: List upcoming medical missions (public)
 *     tags: [MedicalMissions]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of missions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MedicalMission'
 */
exports.listMissions = async (req, res) => {
  try {
    const { location } = req.query;
    const where = location ? { location, status: 'upcoming' } : { status: 'upcoming' };
    const missions = await MedicalMission.findAll({ where, order: [['start_date', 'ASC']] });
    res.json({ missions });
  } catch (err) {
    console.error('List missions error:', err);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
};

/**
 * @swagger
 * /missions:
 *   post:
 *     summary: Create a new medical mission (NGO only)
 *     tags: [MedicalMissions]
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
 *               - description
 *               - location
 *               - start_date
 *               - end_date
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-07"
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Mission created
 *       403:
 *         description: Only NGOs can create missions
 */
exports.createMission = async (req, res) => {
  try {
    if (req.user.role !== 'ngo') {
      return res.status(403).json({ error: 'Only NGOs can create medical missions' });
    }

    const { title, description, location, start_date, end_date, specialties } = req.body;
    const mission = await MedicalMission.create({
      title,
      description,
      ngo_id: req.user.id,
      location,
      start_date,
      end_date,
      specialties: specialties ? JSON.stringify(specialties) : null,
    });

    res.status(201).json(mission);
  } catch (err) {
    console.error('Create mission error:', err);
    res.status(500).json({ error: 'Failed to create mission' });
  }
};

/**
 * @swagger
 * /missions/{id}/request:
 *   post:
 *     summary: Request to join a medical mission (Patient only)
 *     tags: [MedicalMissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request submitted
 *       403:
 *         description: Only patients can request missions
 */
exports.requestMission = async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ error: 'Only patients can request mission appointments' });
    }

    const { id } = req.params;
    const { notes } = req.body;

    const mission = await MedicalMission.findByPk(id);
    if (!mission || mission.status !== 'upcoming') {
      return res.status(404).json({ error: 'Mission not found or not accepting requests' });
    }

    const request = await MissionRequest.create({
      patient_id: req.user.id,
      mission_id: id,
      notes,
    });

    res.status(201).json({ message: 'Request submitted', requestId: request.id });
  } catch (err) {
    console.error('Request mission error:', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
};