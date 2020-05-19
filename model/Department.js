module.exports = (sequelize, DataTypes) => {
  const department = sequelize.define(
    'department',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  department.associate = (models) => {};
  return department;
};
