const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'users', {
      auth: DataTypes.STRING,
      totalVacation: {
        type: DataTypes.INTEGER,
        defaultValue: 11,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      groupId: DataTypes.INTEGER,
      mobile: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      name: DataTypes.STRING,
    }, {
      hooks: {
        afterValidate: (data, options) => {
          // const encoded = crypto.createHash('sha1');
          // eslint-disable-next-line no-param-reassign
          // data.password = encoded.digest('hex');
        },
      },
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  user.associate = (models) => {
    const { groups, vacations } = models;
    user.hasMany(vacations);
    user.belongsTo(groups);
    groups.hasMany(user);
  };
  return user;
};
