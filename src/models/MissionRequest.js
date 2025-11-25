const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MissionRequest = sequelize.define('MissionRequest', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  mission_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'mission_requests',
  timestamps: true,
  underscored: true,
});

module.exports = MissionRequest;