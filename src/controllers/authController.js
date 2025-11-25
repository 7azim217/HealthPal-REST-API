const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'healthpal_secret_2025';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Ahmad Hassan"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ahmad@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secure123"
 *               role:
 *                 type: string
 *                 enum: [patient, doctor, donor, ngo, admin]
 *                 default: patient
 *               language:
 *                 type: string
 *                 enum: [ar, en]
 *                 default: ar
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already exists
 */
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role = 'patient', language = 'ar' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      language,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "ahmad@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "secure123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Email and password required
 *       401:
 *         description: Invalid credentials
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        language: user.language,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Ahmad Hassan"
 *         email:
 *           type: string
 *           example: "ahmad@example.com"
 *         role:
 *           type: string
 *           enum: [patient, doctor, donor, ngo, admin]
 *           example: patient
 *         language:
 *           type: string
 *           enum: [ar, en]
 *           example: ar
 */