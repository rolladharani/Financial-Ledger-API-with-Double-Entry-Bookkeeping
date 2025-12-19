const Account = require('../models/account.model');
const LedgerEntry = require('../models/ledgerEntry.model');
const { Sequelize } = require('sequelize');

// CREATE ACCOUNT
exports.createAccount = async (req, res) => {
  try {
    const account = await Account.create(req.body);
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ACCOUNT WITH BALANCE
exports.getAccountById = async (req, res) => {
  try {
    const account = await Account.findByPk(req.params.id);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const result = await LedgerEntry.findOne({
      where: { account_id: account.id },
      attributes: [[
        Sequelize.literal(`
          COALESCE(
            SUM(
              CASE 
                WHEN entry_type = 'credit' THEN amount
                WHEN entry_type = 'debit' THEN -amount
              END
            ), 0
          )
        `),
        'balance'
      ]],
      raw: true
    });

    res.json({
      ...account.toJSON(),
      balance: result.balance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET LEDGER FOR ACCOUNT
exports.getAccountLedger = async (req, res) => {
  try {
    const entries = await LedgerEntry.findAll({
      where: { account_id: req.params.id },
      order: [['createdAt', 'ASC']]
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
