module.exports = (sequelize, DataTypes) => {
  const groups = sequelize.define(
    'groups',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      managerId: DataTypes.INTEGER,
      companyId: DataTypes.INTEGER,
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  groups.associate = (models) => {
    const { users, companies } = models;
    groups.belongsTo(companies);
    groups.hasMany(users);
    users.belongsTo(groups);
  };
  return groups;
};
