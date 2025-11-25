const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TherapyChat = sequelize.define('TherapyChat', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'Patient or user seeking support'
  },
  counselor_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Assigned counselor (doctor)'
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  topic: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., PTSD, grief, anxiety'
  },
  status: {
    type: DataTypes.ENUM('active', 'closed'),
    defaultValue: 'active',
  },
}, {
  tableName: 'therapy_chats',
  timestamps: true,
  underscored: true,
});

module.exports = TherapyChat;