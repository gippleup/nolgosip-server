const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;

  const companies = db.companies.findAll({ where: {} });
  res.json(companies);
};
