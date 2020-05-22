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
    where: {
      userId: userJSON.id,
    },
  });


  console.log(vacationData.map((ele) => ele.toJSON()));
  const filteredVacationData = vacationData
    .map((ele) => ele.toJSON())
    .filter((ele) => {
      const validFrom = Date.parse(ele.from) - Date.parse(from) > 0;
      const validTo = Date.parse(to) - Date.parse(ele.to) > 0;
      return validFrom && validTo;
    })
    .map((ele) => {
      const filteredData = {
        id: ele.id,
        from: ele.from,
        to: ele.to,
        status: ele.status,
        reason: ele.reason,
        createdAt: ele.createdAt,
      };
      return filteredData;
    });

  res.json({
    userName: userJSON.name,
    vacations: filteredVacationData,
  });
};
