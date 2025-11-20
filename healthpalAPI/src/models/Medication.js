// src/models/Medication.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medication = sequelize.define('Medication', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'e.g., Insulin, Paracetamol, Oxygen Tank'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  category: {
    type: DataTypes.ENUM('medicine', 'equipment'),
    defaultValue: 'medicine',
  },
  provider_type: {
    type: DataTypes.ENUM('pharmacy', 'ngo', 'donor'),
    allowNull: false,
  },
  provider_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'ID of the user (pharmacy/NGO/donor) providing this item'
  },
}, {
  tableName: 'medications',
  timestamps: true,
  underscored: true,
});

module.exports = Medication;