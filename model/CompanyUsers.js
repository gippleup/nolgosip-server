module.exports = (sequelize, DataTypes) => {
  const companyUsers = sequelize.define(
    'companyUsers', {
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  companyUsers.associate = (models) => {
  };
  return companyUsers;
};
