const utils = require('../utils');

module.exports = async (req, res, userJSON) => {
  const { db } = res;
  const { name } = req.body;

  if (!name) return res.endWithMessage(400, 'NAME SHOULD BE PROVIDED');
  const existingCompany = await db.companies.findOne({ where: { name } });
  if (existingCompany) return res.endWithMessage(400, 'COMPANY ALREADY EXIST');
  const newCompany = await db.companies.create({ name });
  newCompany.adminId = userJSON.id;
  await newCompany.save();
  return res.json(newCompany);
};
