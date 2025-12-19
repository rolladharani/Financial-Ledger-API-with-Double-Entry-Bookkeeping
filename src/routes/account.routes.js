const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account.controller');

// CREATE ACCOUNT
router.post('/', accountController.createAccount);

// GET ACCOUNT WITH BALANCE
router.get('/:id', accountController.getAccountById);

// GET LEDGER FOR ACCOUNT
router.get('/:id/ledger', accountController.getAccountLedger);

module.exports = router;
