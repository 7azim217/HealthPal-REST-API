const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  requester_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  medication_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'fulfilled', 'cancelled'),
    defaultValue: 'pending',
  },
  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'requests',
  timestamps: true,
  underscored: true,
});

module.exports = Request;