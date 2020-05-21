const jwt = require('jsonwebtoken');
const config = require('../config');

const util = {
  sequelize: {
    findOne(model, options) {
      return model.findOne(options)
        .then((data) => {
          if (data) return data.toJSON();
          return false;
        });
    },
  },
  jwt: {
    sign(payload) {
      return jwt.sign({
        exp: Math.floor(Date.now() / 1000 + (0.01 * 60)),
        data: payload,
      }, config.jwtSecret);
    },
    verify(token, callback) {
      return jwt.verify(token, config.jwtSecret, callback);
    },
  },
};


module.exports = util;
