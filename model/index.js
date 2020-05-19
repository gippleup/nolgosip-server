const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

const db = {};
const curFile = path.basename(__filename); // index.js

const sequelize = new Sequelize(config);

sequelize.sync({
  force: false,
});

fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.') !== -1 && file !== curFile && file.slice(-3) === '.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });


Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
