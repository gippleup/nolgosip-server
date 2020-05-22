const { Op } = require('sequelize');
const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;
  const { name, option } = req.body;

  if (!name) return res.status(400).end('NAME IS REQUIRED');
  if (!option) return res.status(400).end('OPTION IS REQUIRED');

  const targetGroup = await utils.sequelize.findOne(db.groups, {
    where: {
      name: {
        [Op.eq]: name,
      },
    },
  });
  const targetGroupJSON = targetGroup.toJSON();
  if (!targetGroupJSON) return res.end('NO GROUP');

  Object.keys(option)
    .filter((key) => {
      return key === 'name' || key === 'managerId';
    })
    .forEach((key) => {
      targetGroup[key] = option[key];
    });

  await targetGroup.save();
  return res.json(targetGroup);
};
