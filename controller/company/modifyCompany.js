const utils = require('../utils');
const { Op } = require('sequelize');

module.exports = async (req, res, userJSON) => {
  const { db } = res;
  const { name, option } = req.body;

  if (userJSON.auth !== 'admin') return res.endWithMessage(400, 'UNAUTHORIZED REQUEST');
  if (!name) return res.endWithMessage(400, 'NAME IS REQUIRED');
  if (!option) return res.endWithMessage(400, 'OPTION IS REQUIRED');

  const targetCompany = await db.companies.findOne({
    where: {
      name: {
        [Op.eq]: name,
      },
    },
  });

  if (!targetCompany) return res.endWithMessage(400, 'NO SUCH COMPANY');

  Object.keys(option)
    .filter((key) => key === 'name' || key === 'managerId')
    .forEach((key) => {
      targetCompany[key] = option[key];
    });

  await targetCompany.save();
  return res.json(targetCompany);
};
