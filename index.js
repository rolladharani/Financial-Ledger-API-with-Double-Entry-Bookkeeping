require('dotenv').config();
const express = require('express');
const { connectWithRetry, sequelize } = require('./src/config/db');

// register models
require('./src/models/account.model');
require('./src/models/transaction.model');
require('./src/models/ledgerEntry.model');

const app = express();
app.use(express.json());

// 🔴 THIS PART MUST EXIST
const accountRoutes = require('./src/routes/account.routes');
app.use('/accounts', accountRoutes);

const transactionRoutes = require('./src/routes/transaction.routes');
app.use('/transactions', transactionRoutes);

const ledgerRoutes = require('./src/routes/ledgerEntry.routes');
app.use('/', ledgerRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'Financial Ledger API is running' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectWithRetry();
  await sequelize.sync({ alter: true });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
