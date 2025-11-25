const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Consultation = sequelize.define('Consultation', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  patient_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  doctor_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  mode: {
    type: DataTypes.ENUM('video', 'audio', 'chat'),
    defaultValue: 'video',
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  needs_translation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  transcript: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'consultations',
  timestamps: true,
  underscored: true,
});

module.exports = Consultation;