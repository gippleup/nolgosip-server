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
    const { groups, users } = models;
    companies.hasMany(groups);
    companies.hasMany(users);
    groups.belongsTo(companies);
  };
  return companies;
};
