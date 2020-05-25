const { Op } = require('sequelize');

module.exports = async (req, res, userJSON) => {
  const { db } = res;
  const { email, from, to } = req.body;
  const targetUser = await db.users.findOne({
    where: {
      email,
    },
  });

  if (!email) return res.status(400).end('TARGET EMAIL IS NOT SPECIFIED');
  if (!targetUser) return res.status(404).end('NO SUCH USER');

  const targetUserJSON = targetUser.toJSON();
  const vacationData = await db.vacations.findAll({
    attributes: ['id', 'from', 'to', 'status', 'reason', 'createdAt'],
    where: {
      userId: targetUserJSON.id,
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
    userName: targetUserJSON.name,
    vacations: filteredVacationData,
  });
};
