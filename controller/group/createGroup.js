const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;
  const { name } = req.body;

  if (!name) return res.end('NAME MUST BE PROVIDED');
  const existingGroup = await db.groups.findOne({ where: { name } });
  if (existingGroup) return res.end('GROUP ALREADY EXIST');
  const newGroup = await db.groups.create({ name });
  return res.json(newGroup);
};
