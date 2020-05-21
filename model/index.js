const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const axios = require('axios').default;

const db = {};
const curFile = path.basename(__filename); // index.js

const sequelize = new Sequelize(config.db);

sequelize.sync({
  force: true,
})
  .then(() => {
    axios({
      method: 'post',
      url: 'http://localhost:5000/signup',
      data: {
        name: '김회장',
        email: 'ceoKim1919@gmail.com',
        mobile: '010-1919-9191',
        password: '1q2w3e4r',
      },
    });
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
