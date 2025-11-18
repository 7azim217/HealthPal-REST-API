// src/models/ChatMessage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  chat_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  sender_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    comment: 'User ID or counselor ID'
  },
  sender_role: {
    type: DataTypes.ENUM('user', 'counselor'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'chat_messages',
  timestamps: true,
  underscored: true,
});

module.exports = ChatMessage;