const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING, // savings / checking
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active', // active / frozen
  },
}, {
  tableName: 'accounts',
  timestamps: true,
});

module.exports = Account;
