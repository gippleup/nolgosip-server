module.exports = (sequelize, DataTypes) => {
  const groupUsers = sequelize.define(
    'groupUsers', {
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  groupUsers.associate = (models) => {};
  return groupUsers;
};
