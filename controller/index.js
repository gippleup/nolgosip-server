const signup = require('./signup');
const signin = require('./signin');
const signout = require('./signout');
const vacation = require('./vacation/_index');
const users = require('./users/_index');
const group = require('./group/_index');
const company = require('./company/_index');

const controller = {
  signup,
  signin,
  signout,
  group,
  users,
  vacation,
  company,
};

module.exports = controller;
