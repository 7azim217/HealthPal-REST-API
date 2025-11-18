// src/controllers/consultationController.js
const Consultation = require('../models/Consultation');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Consultations
 *   description: Manage remote medical consultations between patients and doctors
 */

/**
 * @swagger
 * /consultations:
 *   post:
 *     summary: Book a new consultation (Patient only)
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor_id
 *               - scheduled_at
 *             properties:
 *               doctor_id:
 *                 type: integer
 *                 description: ID of the doctor (must be a verified doctor)
 *                 example: 2
 *               scheduled_at:
 *                 type: string
 *                 format: date-time
 *                 description: ISO 8601 datetime for the appointment
 *                 example: "2025-11-01T10:00:00Z"
 *               mode:
 *                 type: string
 *                 enum: [video, audio, chat]
 *                 description: Consultation mode (use 'audio' or 'chat' for low-bandwidth areas)
 *                 default: video
 *                 example: audio
 *     responses:
 *       201:
 *         description: Consultation booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 consultation:
 *                   $ref: '#/components/schemas/Consultation'
 *       400:
 *         description: Invalid doctor ID or missing fields
 *       403:
 *         description: Access denied (not a patient)
 */
exports.bookConsultation = async (req, res) => {
  try {
    const { doctor_id, scheduled_at, mode = 'video' } = req.body;
    const patient_id = req.user.id;

    const doctor = await User.findByPk(doctor_id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ error: 'Valid doctor ID required' });
    }

    const needs_translation = req.user.language !== doctor.language;

    const consultation = await Consultation.create({
      patient_id,
      doctor_id,
      scheduled_at,
      mode,
      needs_translation,
    });

    res.status(201).json({
      message: 'Consultation booked successfully',
      consultation,
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to book consultation' });
  }
};

/**
 * @swagger
 * /consultations:
 *   get:
 *     summary: Get all consultations for the current user
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consultations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ConsultationWithParticipants'
 *       403:
 *         description: Only patients and doctors can view consultations
 */
exports.getMyConsultations = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let consultations;
    if (role === 'patient') {
      consultations = await Consultation.findAll({
        where: { patient_id: userId },
        include: [
          { model: User, as: 'Doctor', attributes: ['id', 'name', 'language'] }
        ],
      });
    } else if (role === 'doctor') {
      consultations = await Consultation.findAll({
        where: { doctor_id: userId },
        include: [
          { model: User, as: 'Patient', attributes: ['id', 'name', 'language'] }
        ],
      });
    } else {
      return res.status(403).json({ error: 'Only patients and doctors can view consultations' });
    }

    res.json({ consultations });
  } catch (err) {
    console.error('Fetch consultations error:', err);
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
};

/**
 * @swagger
 * /consultations/{id}/status:
 *   put:
 *     summary: Update consultation status
 *     tags: [Consultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Consultation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 description: New status. Patients can only set 'cancelled'. Doctors can set any.
 *                 example: completed
 *     responses:
 *       200:
 *         description: Consultation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 consultation:
 *                   $ref: '#/components/schemas/Consultation'
 *       403:
 *         description: Not authorized to update this consultation
 *       404:
 *         description: Consultation not found
 */
exports.updateConsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const role = req.user.role;

    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    if (role === 'doctor' && consultation.doctor_id !== userId) {
      return res.status(403).json({ error: 'Not your consultation' });
    }
    if (role === 'patient' && consultation.patient_id !== userId) {
      return res.status(403).json({ error: 'Not your consultation' });
    }

    if (role === 'patient' && status !== 'cancelled') {
      return res.status(400).json({ error: 'Patients can only cancel consultations' });
    }

    consultation.status = status;
    await consultation.save();

    res.json({ message: 'Consultation updated', consultation });
  } catch (err) {
    console.error('Update consultation error:', err);
    res.status(500).json({ error: 'Failed to update consultation' });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Consultation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         patient_id:
 *           type: integer
 *           example: 1
 *         doctor_id:
 *           type: integer
 *           example: 2
 *         scheduled_at:
 *           type: string
 *           format: date-time
 *           example: "2025-11-01T10:00:00Z"
 *         mode:
 *           type: string
 *           enum: [video, audio, chat]
 *           example: audio
 *         status:
 *           type: string
 *           enum: [scheduled, completed, cancelled]
 *           example: scheduled
 *         needs_translation:
 *           type: boolean
 *           description: True if patient and doctor speak different languages (Arabic/English)
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     ConsultationWithParticipants:
 *       allOf:
 *         - $ref: '#/components/schemas/Consultation'
 *         - type: object
 *           properties:
 *             Doctor:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 language:
 *                   type: string
 *                   enum: [ar, en]
 *             Patient:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 language:
 *                   type: string
 *                   enum: [ar, en]
 */