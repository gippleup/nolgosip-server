const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({
  path: envPath,
});

const dbHost = process.env.DB_HOST;
const dbPass = process.env.DB_PASS;
const dbPort = process.env.DB_PORT;

module.exports = {
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    timestamps: true,
  },
  host: dbHost,
  port: dbPort,
  password: dbPass,
  dialect: 'mysql',
  database: 'develop',
  username: 'admin',
};
