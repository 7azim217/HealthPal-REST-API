/**
 * @swagger
 * tags:
 *   name: Treatments
 *   description: Medical treatment sponsorship system (surgeries, dialysis, cancer care, etc.)
 *
 * components:
 *   schemas:
 *     Treatment:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - goal_amount
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         patient_id:
 *           type: integer
 *           example: 3
 *         title:
 *           type: string
 *           example: "Knee Replacement Surgery"
 *         description:
 *           type: string
 *           example: "Patient needs full knee replacement due to war injury."
 *         category:
 *           type: string
 *           enum: [surgery, cancer, dialysis, rehabilitation, other]
 *           example: surgery
 *         goal_amount:
 *           type: number
 *           format: float
 *           example: 2500.00
 *         funded_amount:
 *           type: number
 *           format: float
 *           example: 1200.00
 *         status:
 *           type: string
 *           enum: [active, funded, completed]
 *           example: active
 *         consent_given:
 *           type: boolean
 *           description: Patient has consented to share medical details publicly
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     TreatmentPublic:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         goal_amount:
 *           type: number
 *           format: float
 *         funded_amount:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *         Patient:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             language:
 *               type: string
 *               enum: [ar, en]
 *
 *     Donation:
 *       type: object
 *       required:
 *         - treatment_id
 *         - amount
 *       properties:
 *         id:
 *           type: integer
 *         donor_id:
 *           type: integer
 *         treatment_id:
 *           type: integer
 *         amount:
 *           type: number
 *           format: float
 *           example: 100.00
 *         receipt_url:
 *           type: string
 *           format: uri
 *           example: "https://example.com/receipts/don123.pdf"
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     TransparencyReport:
 *       type: object
 *       properties:
 *         treatment:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             title:
 *               type: string
 *             goal_amount:
 *               type: number
 *               format: float
 *             funded_amount:
 *               type: number
 *               format: float
 *         donations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               donor_name:
 *                 type: string
 *               amount:
 *                 type: number
 *                 format: float
 *               receipt_url:
 *                 type: string
 *               donated_at:
 *                 type: string
 *                 format: date-time
 */

//const { Treatment, Donation } = require('../models');
const { Treatment, Donation, User } = require('../models');
/**
 * @swagger
 * /treatments:
 *   post:
 *     summary: Create a new treatment request (Patient only)
 *     tags: [Treatments]
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
 *               - category
 *               - goal_amount
 *             properties:
 *               title:
 *                 type: string
 *                 example: "6 Months of Dialysis"
 *               description:
 *                 type: string
 *                 example: "Child with kidney failure needs ongoing dialysis."
 *               category:
 *                 type: string
 *                 enum: [surgery, cancer, dialysis, rehabilitation, other]
 *               goal_amount:
 *                 type: number
 *                 format: float
 *                 example: 3000.00
 *               consent_given:
 *                 type: boolean
 *                 description: Must be true to share medical details publicly
 *                 example: true
 *     responses:
 *       201:
 *         description: Treatment request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Treatment'
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Only patients can create treatment requests
 */
exports.createTreatment = async (req, res) => {
  try {
    const { title, description, category, goal_amount, consent_given = false } = req.body;
    const patient_id = req.user.id;

    if (!title || !description || !goal_amount) {
      return res.status(400).json({ error: 'Title, description, and goal amount are required' });
    }

    const treatment = await Treatment.create({
      patient_id,
      title,
      description,
      category,
      goal_amount,
      consent_given,
    });

    res.status(201).json({ message: 'Treatment request created', treatment });
  } catch (err) {
    console.error('Create treatment error:', err);
    res.status(500).json({ error: 'Failed to create treatment request' });
  }
};

/**
 * @swagger
 * /treatments:
 *   get:
 *     summary: Get all active/public treatment requests
 *     tags: [Treatments]
 *     description: Anyone can view active treatment requests (no auth required)
 *     responses:
 *       200:
 *         description: List of public treatments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 treatments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TreatmentPublic'
 */
exports.getTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.findAll({
      where: { status: 'active' },
      attributes: ['id', 'title', 'description', 'category', 'goal_amount', 'funded_amount', 'status'],
      include: [{
        model: User,
        as: 'Patient',
        attributes: ['name', 'language']
      }]
    });
    res.json({ treatments });
  } catch (err) {
    console.error('Fetch treatments error:', err);
    res.status(500).json({ error: 'Failed to fetch treatments' });
  }
};

/**
 * @swagger
 * /treatments/donations:
 *   post:
 *     summary: Donate to a treatment (Donor only)
 *     tags: [Treatments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - treatment_id
 *               - amount
 *             properties:
 *               treatment_id:
 *                 type: integer
 *                 example: 1
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 250.00
 *               receipt_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/receipts/d123.pdf"
 *     responses:
 *       201:
 *         description: Donation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Invalid amount or treatment ID
 *       403:
 *         description: Only donors can make donations
 *       404:
 *         description: Treatment not found
 */
exports.donate = async (req, res) => {
  try {
    const { treatment_id, amount, receipt_url } = req.body;
    const donor_id = req.user.id;

    if (!treatment_id || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid treatment ID and positive amount required' });
    }

    const treatment = await Treatment.findByPk(treatment_id);
    if (!treatment) {
      return res.status(404).json({ error: 'Treatment not found' });
    }

    const donation = await Donation.create({
      donor_id,
      treatment_id,
      amount,
      receipt_url,
    });

    treatment.funded_amount = parseFloat(treatment.funded_amount) + parseFloat(amount);
    if (treatment.funded_amount >= treatment.goal_amount) {
      treatment.status = 'funded';
    }
    await treatment.save();

    res.status(201).json({ message: 'Donation successful', donation });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ error: 'Donation failed' });
  }
};

/**
 * @swagger
 * /treatments/{id}/transparency:
 *   get:
 *     summary: Get transparency report for a treatment
 *     tags: [Treatments]
 *     description: Shows all donations, receipts, and funding progress (public access)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Treatment ID
 *     responses:
 *       200:
 *         description: Transparency report
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransparencyReport'
 *       404:
 *         description: Treatment not found
 */
exports.getTransparencyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const treatment = await Treatment.findByPk(id, {
      include: [{
        model: Donation,
        as: 'Donations',
        include: [{
          model: User,
          as: 'Donor',
          attributes: ['name']
        }]
      }]
    });

    if (!treatment) {
      return res.status(404).json({ error: 'Treatment not found' });
    }

    res.json({
      treatment: {
        id: treatment.id,
        title: treatment.title,
        goal_amount: parseFloat(treatment.goal_amount),
        funded_amount: parseFloat(treatment.funded_amount),
      },
      donations: treatment.Donations.map(d => ({
        donor_name: d.Donor ? d.Donor.name : 'Anonymous Donor',
        amount: parseFloat(d.amount),
        receipt_url: d.receipt_url || null,
        donated_at: d.created_at,
      })),
    });
  } catch (err) {
    console.error('🔴 Transparency report error:', err);
    res.status(500).json({ error: 'Failed to generate transparency report' });
  }
};
