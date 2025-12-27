const { sequelize } = require('../config/db');
const Transaction = require('../models/transaction.model');
const LedgerEntry = require('../models/ledgerEntry.model');
const LedgerService = require('../services/ledger.service');

// Helper: get balance safely
const getBalance = async (accountId, t) => {
  const result = await LedgerEntry.findOne({
    where: { account_id: accountId },
    attributes: [[
      sequelize.literal(`
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
    transaction: t,
    raw: true
  });

  return result.balance; // string
};

exports.createTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { type, amount, from_account_id, to_account_id } = req.body;

    if (!type || typeof amount !== 'number' || amount <= 0) {
      await t.rollback();
      return res.status(400).json({
        message: 'type and amount (positive number) are required'
      });
    }

    const txn = await Transaction.create(
      { type, amount, status: 'completed' },
      { transaction: t }
    );

    if (type === 'deposit') {
      if (!to_account_id) throw new Error('to_account_id required');

      await LedgerService.createEntry({
        account_id: to_account_id,
        transaction_id: txn.id,
        entry_type: 'credit',
        amount,
        t
      });
    }

    if (type === 'withdrawal') {
      if (!from_account_id) throw new Error('from_account_id required');

      const balance = await getBalance(from_account_id, t);
      if (parseFloat(balance) < amount) {
        await t.rollback();
        return res.status(422).json({ message: 'Insufficient balance' });
      }

      await LedgerService.createEntry({
        account_id: from_account_id,
        transaction_id: txn.id,
        entry_type: 'debit',
        amount,
        t
      });
    }

    if (type === 'transfer') {
      if (!from_account_id || !to_account_id) {
        throw new Error('from_account_id and to_account_id required');
      }

      const balance = await getBalance(from_account_id, t);
      if (parseFloat(balance) < amount) {
        await t.rollback();
        return res.status(422).json({ message: 'Insufficient balance' });
      }

      await LedgerService.createEntry({
        account_id: from_account_id,
        transaction_id: txn.id,
        entry_type: 'debit',
        amount,
        t
      });

      await LedgerService.createEntry({
        account_id: to_account_id,
        transaction_id: txn.id,
        entry_type: 'credit',
        amount,
        t
      });
    }

    await t.commit();
    res.status(201).json(txn);
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};
