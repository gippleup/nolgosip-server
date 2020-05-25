const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const mysql = require('mysql');
const config = require('../config');

const db = {};

const mysqlConnetion = mysql.createConnection(config.mysql);
mysqlConnetion.connect();

const curFile = path.basename(__filename); // index.js

const sequelize = new Sequelize(config.sequelize);

const sampleData = require('../__test__/fixtures/users.json');

const localUrl = (route, queryObj) => {
  const baseURL = 'http://localhost:5000';
  const queries = !queryObj ? '' : Object.keys(queryObj).map((key) => `?${key}=${queryObj[key]}`).join('');
  const url = `${baseURL}/${route}${queries}`;
  return url;
};
const createSession = async (user) => {
  const session = await axios.create({ baseURL: localUrl('') });
  const authParams = user;
  const res = await axios.post(localUrl('signin'), authParams);
  const cookie = res.headers['set-cookie'][1];
  session.defaults.headers.Cookie = cookie;
  return session;
};

let admin = null;
sequelize.sync({
  force: true,
})
  .then(() => Promise.all(
    sampleData.map(
      (data, i) => new Promise((resolve, reject) => {
        setTimeout(() => {
          const request = axios({
            method: 'post',
            url: localUrl('signup'),
            data,
          });
          resolve(request);
        }, 100 * i);
      }),
    ),
  ))
  .then(() => createSession(sampleData[0]))
  .then((session) => {
    admin = session;
    sampleData.map(async (data, i) => {
      try {
        await new Promise((resolve) => setTimeout(() => {
          resolve('ok');
        }, 50 * i));
        if (data.group) {
          await admin.post(localUrl('group'), {
            type: 'create',
            name: data.group,
          });
          await admin.post(localUrl('users'), {
            type: 'setGroup',
            groupName: data.group,
            userEmail: data.email,
          });
        }
        const user = await createSession(data);
        await user.post(localUrl('vacation'), {
          type: 'request',
          from: data.vacations[0] ? Date.parse(data.vacations[0].from) : '',
          to: data.vacations[0] ? Date.parse(data.vacations[0].to) : '',
          reason: '그냥',
        });
        await admin.post(localUrl('users'), {
          type: 'setAuth',
          auth: data.auth,
          email: data.email,
        });
      } catch (err) {
        const { config, status, statusText } = err.response;
        const { url, method, data } = config;
        console.log({ status, statusText, url, method, data: JSON.parse(data) });
      }
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
db.mysql = mysqlConnetion;

module.exports = db;
