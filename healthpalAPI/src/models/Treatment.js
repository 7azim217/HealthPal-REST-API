// src/models/Treatment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Treatment = sequelize.define('Treatment', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'e.g., "Knee Surgery", "6 Months of Dialysis"',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('surgery', 'cancer', 'dialysis', 'rehabilitation', 'other'),
    allowNull: false,
  },
  goal_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Total amount needed (USD)',
  },
  funded_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.ENUM('active', 'funded', 'completed'),
    defaultValue: 'active',
  },
  consent_given: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Patient consent to share medical info',
  },
}, {
  tableName: 'treatments',
  timestamps: true,
  underscored: true,
});

module.exports = Treatment;