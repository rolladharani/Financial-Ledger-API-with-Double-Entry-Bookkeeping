const LedgerEntry = require('../models/ledgerEntry.model');

exports.createEntry = async ({
  account_id,
  transaction_id,
  entry_type, // 'debit' | 'credit'
  amount,
  t, // sequelize transaction
}) => {
  return LedgerEntry.create(
    { account_id, transaction_id, entry_type, amount },
    { transaction: t }
  );
};
