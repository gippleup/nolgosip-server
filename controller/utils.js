const jwt = require('jsonwebtoken');
const config = require('../config');

const util = {
  sequelize: {
    findOne(model, options) {
      return model.findOne(options)
        .then((data) => {
          if (data) return data;
          return false;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    findAll(model, options) {
      return model.findAll(options)
        .then((data) => {
          if (data) return data;
          return false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },

  jwt: {
    sign(payload) {
      return jwt.sign({
        exp: Math.floor(Date.now() / 1000 + (30 * 60)),
        data: payload,
      }, config.jwtSecret);
    },

    verify(token, callback) {
      return jwt.verify(token, config.jwtSecret, callback);
    },
  },

  notAnyOf(value, targetValues) {
    for (let i = 0; i < targetValues.length; i += 1) {
      if (value === targetValues[i]) return false;
    }
    return false;
  },

  isAnyOf(value, targetValues) {
    for (let i = 0; i < targetValues.length; i += 1) {
      if (value === targetValues[i]) return true;
    }
    return false;
  },

  toObj(arr) {
    const result = {};
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i].length !== 2) throw new Error('Require key-value pair');
      const [key, value] = arr[i];
      result[key] = value;
    }
    return result;
  },

  objInclude(original, targetKeys) {
    const filteredKey = Object.keys(original).filter((key) => util.isAnyOf(key, targetKeys));
    const filteredData = util.toObj(filteredKey.map((key) => [key, original[key]]));
    return filteredData;
  },

  objExclude(original, targetKeys) {
    const filteredKey = Object.keys(original).filter((key) => util.notAnyOf(key, targetKeys));
    const filteredData = util.toObj(filteredKey.map((key) => [key, original[key]]));
    return filteredData;
  },
};


module.exports = util;
