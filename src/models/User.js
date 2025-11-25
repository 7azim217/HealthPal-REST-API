const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('patient', 'doctor', 'donor', 'ngo', 'admin'),
    allowNull: false,
    defaultValue: 'patient',
  },
  language: {
    type: DataTypes.ENUM('ar', 'en'),
    allowNull: false,
    defaultValue: 'ar',
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
});

module.exports = User;