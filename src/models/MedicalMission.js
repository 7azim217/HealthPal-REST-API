const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalMission = sequelize.define('MedicalMission', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'e.g., "Gaza Pediatric Surgery Camp"'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ngo_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Verified NGO organizing the mission'
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'e.g., Gaza City, Khan Younis'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'active', 'completed'),
    defaultValue: 'upcoming',
  },
  specialties: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
}, {
  tableName: 'medical_missions',
  timestamps: true,
  underscored: true,
});

module.exports = MedicalMission;