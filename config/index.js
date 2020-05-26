const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
require('dotenv').config({
  path: envPath,
});

const devEnv = process.env.DEV_ENV;

const dbHost = process.env.DB_HOST;
const dbPass = process.env.DB_PASS;
const dbPort = process.env.DB_PORT;
let subDb = '';

if (devEnv === 'TEST') {
  subDb = process.env.DB_SUBDB_TEST;
} else if (devEnv === 'DEVELOP') {
  subDb = process.env.DB_SUBDB_DEVELOPMENT;
} else {
  subDb = process.env.DB_SUBDB_PRODUCTION;
}

const sessionSecret = process.env.SESSION_SECRET;

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
  mysql: {
    host: dbHost,
    user: 'admin',
    password: dbPass,
    database: subDb,
    port: dbPort,
  },
  sequelize: {
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      timestamps: true,
    },
    host: dbHost,
    port: dbPort,
    password: dbPass,
    dialect: 'mysql',
    database: subDb,
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
