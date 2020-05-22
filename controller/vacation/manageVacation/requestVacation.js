const { Op } = require('sequelize');

// 신청한 휴가기간이 남은 휴가일보다 크다면 에러 보내야함
module.exports = async (req, res, userJSON) => {
  const { from, to, reason } = req.body;
  const { db } = res;

  if (!from || !to || !reason) return res.end('INVALID INPUT');

  const usedVacations = await db.vacations.findAll({
    where: {
      userId: userJSON.id,
      status: 'complete',
      from: {
        [Op.lte]: '2020-01-01',
      },
      to: {
        [Op.gte]: '2020-12-31',
      },
    },
  });

  const requestedVacationInMs = Date.parse(to) - Date.parse(from);
  const usedVacationJSON = usedVacations.map((item) => item.toJSON());
  const usedVacationTotal = usedVacationJSON.reduce(
    (acc, ele) => acc + Date.parse(ele.to) - Date.parse(ele.from), 0,
  );

  if (usedVacationTotal + requestedVacationInMs / 1000 > userJSON.totalVacation * 24 * 60 * 60) return res.end('LIMIT');
  const newVacation = await db.vacations.create({
    from,
    to,
    reason,
    userId: userJSON.id,
  });

  const vacationJSON = newVacation.toJSON();
  const resData = {
    id: vacationJSON.id,
  };

  return res.json(resData);
};
