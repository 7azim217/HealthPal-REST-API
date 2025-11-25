const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HealthAlert = sequelize.define('HealthAlert', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
}, {
  tableName: 'health_alerts',
  timestamps: true,
  underscored: true,
});

module.exports = HealthAlert;