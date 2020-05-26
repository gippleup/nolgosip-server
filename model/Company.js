module.exports = (sequelize, DataTypes) => {
  const companies = sequelize.define(
    'companies',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adminId: DataTypes.INTEGER,
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  companies.associate = (models) => {
    const { groups, users, companyUsers } = models;
    companies.hasMany(groups);
    companies.belongsToMany(users, { through: companyUsers });
  };
  return companies;
};
