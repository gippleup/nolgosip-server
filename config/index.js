const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({
  path: envPath,
});

const dbHost = process.env.DB_HOST;
const dbPass = process.env.DB_PASS;
const dbPort = process.env.DB_PORT;

const sessionSecret = process.env.SESSION_SECRET;

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
  db: {
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
  },
  session: {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  },
  jwtSecret,
};
