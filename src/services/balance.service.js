const LedgerEntry = require('../models/ledgerEntry.model');
const { Sequelize } = require('sequelize');

exports.getAccountBalance = async (account_id, transaction = null) => {
  const result = await LedgerEntry.findOne({
    where: { account_id },
    attributes: [
      [
        Sequelize.literal(`
          COALESCE(
            SUM(
              CASE
                WHEN entry_type = 'credit' THEN amount
                WHEN entry_type = 'debit' THEN -amount
                ELSE 0
              END
            ), 0
          )
        `),
        'balance'
      ]
    ],
    transaction,
    raw: true
  });

  // ✅ return as STRING to preserve financial precision
  return result.balance;
};
