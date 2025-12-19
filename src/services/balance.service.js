const LedgerEntry = require('../models/ledgerEntry.model');
const { Sequelize } = require('sequelize');

exports.getAccountBalance = async (account_id) => {
  const result = await LedgerEntry.findAll({
    where: { account_id },
    attributes: [
      [
        Sequelize.literal(`
          SUM(
            CASE 
              WHEN entry_type = 'credit' THEN amount
              WHEN entry_type = 'debit' THEN -amount
              ELSE 0
            END
          )
        `),
        'balance',
      ],
    ],
    raw: true,
  });

  return Number(result[0].balance || 0);
};
