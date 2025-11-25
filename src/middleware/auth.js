const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'healthpal_secret_2025';

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};