const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LedgerEntry = sequelize.define('LedgerEntry', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.INTEGER,
  },
  entry_type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['debit', 'credit']],
    },
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
});

module.exports = LedgerEntry;
