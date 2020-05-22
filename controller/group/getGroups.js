const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;

  const groups = await utils.sequelize.findAll(db.groups, { where: {} });
  res.json(groups);
};
