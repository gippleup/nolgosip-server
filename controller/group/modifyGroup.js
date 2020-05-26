const utils = require('../utils');
const { Op } = require('sequelize');

module.exports = async (req, res) => {
  const { db } = res;
  const { name, option } = req.body;

  if (!name) return res.endWithMessage(400, 'NAME IS REQUIRED');
  if (!option) return res.endWithMessage(400, 'OPTION IS REQUIRED');

  const targetGroup = await db.groups.findOne({
    where: {
      name: {
        [Op.eq]: name,
      },
    },
  });

  if (!targetGroup) return res.endWithMessage(400, 'NO SUCH GROUP');

  Object.keys(option)
    .filter((key) => key === 'name' || key === 'managerId')
    .forEach((key) => {
      targetGroup[key] = option[key];
    });

  await targetGroup.save();
  return res.json(targetGroup);
};
