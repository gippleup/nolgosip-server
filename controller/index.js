const signup = require('./signup');
const signin = require('./signin');
const signout = require('./signout');

const controller = {
  signup,
  signin,
  signout,
  employee: (req, res) => {
    res.end();
  },
  department: (req, res) => {
    res.end();
  },
  vacation: (req, res) => {
    res.end();
  },
};

module.exports = controller;
