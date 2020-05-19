const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user', {
      auth: DataTypes.STRING,
      usedVacation: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      leftVacation: {
        type: DataTypes.INTEGER,
        defaultValue: 11,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      mobile: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      password: DataTypes.STRING,
      name: DataTypes.STRING,
    }, {
      hooks: {
        afterValidate: (data, options) => {
          const encoded = crypto.createHash('sha1');
          encoded.update(data.password);
          // eslint-disable-next-line no-param-reassign
          data.password = encoded.digest('hex');
        },
      },
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  user.associate = (models) => {};
  return user;
};
