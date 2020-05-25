const { Op } = require('sequelize');

module.exports = async (req, res, token) => {
  const { db } = res;
  const { email, from, to } = req.body;
  const user = await db.users.findOne({
    where: {
      email,
    },
  });


  const userJSON = user.toJSON();
  const vacationData = await db.vacations.findAll({
    attributes: ['id', 'from', 'to', 'status', 'reason', 'createdAt'],
    where: {
      userId: userJSON.id,
      from: {
        [Op.gte]: from,
      },
      to: {
        [Op.lte]: to,
      },
    },
  });


  const filteredVacationData = vacationData
    .map((ele) => ele.toJSON());

  res.json({
    userName: userJSON.name,
    vacations: filteredVacationData,
  });
};
