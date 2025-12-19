const LedgerEntry = require('../models/ledgerEntry.model');

exports.getLedgerByAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const entries = await LedgerEntry.findAll({
      where: { account_id: id },
      order: [['createdAt', 'ASC']],
    });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
