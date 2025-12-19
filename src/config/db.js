const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

const connectWithRetry = () => {
  sequelize.authenticate()
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((err) => {
      console.error(
        'Database connection failed. Retrying in 5 seconds...',
        err.message
      );
      setTimeout(connectWithRetry, 5000);
    });
};

module.exports = { sequelize, connectWithRetry };
