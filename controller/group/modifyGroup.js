const { Op } = require('sequelize');

module.exports = async (req, res) => {
  const { db } = res;
  const { name, option } = req.body;

  if (!name) return res.status(400).end('NAME IS REQUIRED');
  if (!option) return res.status(400).end('OPTION IS REQUIRED');

  const targetGroup = await db.groups.findOne({
    where: {
      name: {
        [Op.eq]: name,
      },
    },
  });

  if (!targetGroup) return res.end('NO GROUP');

  Object.keys(option)
    .filter((key) => key === 'name' || key === 'managerId')
    .forEach((key) => {
      targetGroup[key] = option[key];
    });

  await targetGroup.save();
  return res.json(targetGroup);
};
