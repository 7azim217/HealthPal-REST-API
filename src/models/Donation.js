const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  donor_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  treatment_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  receipt_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Link to digital receipt or invoice',
  },
}, {
  tableName: 'donations',
  timestamps: true,
  underscored: true,
});

module.exports = Donation;