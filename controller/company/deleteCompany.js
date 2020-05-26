const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;
  const { name } = req.body;

  const targetCompany = await db.companies.findOne({ where: { name } });
  if (!targetCompany) return res.endWithMessage(400, 'NO SUCH COMPANY');
  const companyJSON = targetCompany.toJSON();
  const connectedGroups = await db.groups.findAll({
    where: {
      companyId: companyJSON.id,
    },
  });
  const connectedUsers = await db.users.findAll({
    where: {
      companyId: companyJSON.id,
    },
  });
  await Promise.all(connectedGroups.map((connectedGroup) => {
    return connectedGroup.destroy();
  }));
  await Promise.all(connectedUsers.map((connectedUser) => {
    // eslint-disable-next-line no-param-reassign
    connectedUser.companyId = null;
    // eslint-disable-next-line no-param-reassign
    connectedUser.groupId = null;
    return connectedUser.save();
  }));

  await targetCompany.destroy();
  return res.json('DELETE SUCESS');
};
