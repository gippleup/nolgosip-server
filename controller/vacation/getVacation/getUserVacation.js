const { Op } = require('sequelize');
const utils = require('../../utils');

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

  const vacationsJSON = vacationData
    .map((ele) => ele.toJSON());

  const filteredVacationData = {
    used: [],
    approved: [],
    waiting: [],
    expired: [],
    sum: {
      used: 0,
      approved: 0,
      waiting: 0,
      expired: 0,
    },
  };

  const diffInDay = (row) => {
    const dateDiff = Date.parse(row.to) - Date.parse(row.from);
    const result = dateDiff / 1000 / 60 / 60 / 24;
    return result;
  };

  vacationsJSON.forEach((vacation) => {
    const filteredData = {
      id: vacation.id,
      from: vacation.from,
      to: vacation.to,
      reason: vacation.reason,
      createdAt: vacation.createdAt,
      span: diffInDay(vacation),
    };

    const {
      status,
    } = vacation;

    filteredVacationData[status].push(filteredData);
    filteredVacationData.sum[status] += filteredData.span;
  });

  res.json({
    userName: targetUserJSON.name,
    vacations: vacationsJSON,
    filteredVacations: filteredVacationData,
  });
};
