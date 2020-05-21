module.exports = (sequelize, DataTypes) => {
  const vacation = sequelize.define(
    'vacations', {
      from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      to: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'waiting',
      },
      approver: {
        type: DataTypes.STRING,
        defaultValue: 'admin',
      },
      reason: {
        type: DataTypes.STRING,
        defaultValue: '연차',
      },
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );

  vacation.associate = (models) => {};
  return vacation;
};
