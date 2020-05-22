const { Op } = require('sequelize');

module.exports = async (req, res, token) => {
  const { db } = res;
  const { email, from, to } = req.body;
  const group = await db.users.findOne({
    where: {
      email,
    },
    include: db.groups,
  });

  const groupJSON = group.toJSON().group;

  if (!groupJSON) return res.end('USER HAS NO GROUP');

  // const groupJSON = group.map((item) => {
  //   const itemJson = item.toJSON();
  //   return itemJson.group;
  // });

  // if (!groupJSON.length) return res.end('USER HAS NO GROUP');

  // const eqOption = groupJSON
  //   ? groupJSON.reduce((acc, data) => Object.assign(acc, { [Op.eq]: data.id }), {})
  //   : false;

  const vacations = await db.users.findAll({
    where: {
      groupId: {
        [Op.eq]: groupJSON.id,
      },
    },
    include: [db.vacations],
  });

  const vacationData = vacations
    .reduce((acc, ele) => acc.concat(ele.toJSON()), [])
    .filter((data) => data.vacations.length)
    .map((data) => {
      const userVacationData = data.vacations;
      const user = {
        auth: data.auth,
        email: data.email,
        mobile: data.mobile,
        userName: data.name,
      };

      const result = userVacationData.map((ele) => {
        const filteredData = {
          id: ele.id,
          from: ele.from,
          to: ele.to,
          status: ele.status,
          approver: ele.approver,
          reason: ele.reason,
          createdAt: ele.createdAt,
        };
        return Object.assign(filteredData, user);
      });
      return result;
    })
    .reduce((acc, ele) => acc.concat(ele))
    .filter((ele) => {
      const validFrom = Date.parse(ele.from) - Date.parse(from) > 0;
      const validTo = Date.parse(to) - Date.parse(ele.to) > 0;
      return validFrom && validTo;
    });

  res.json({
    groupName: groupJSON.name,
    vacations: vacationData,
  });
};
