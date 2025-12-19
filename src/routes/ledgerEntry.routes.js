const express = require('express');
const router = express.Router();
const ledgerController = require('../controllers/ledgerEntry.controller');

router.get('/accounts/:id/ledger', ledgerController.getLedgerByAccount);

module.exports = router;
