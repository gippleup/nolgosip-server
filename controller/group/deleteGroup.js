const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;
  const { name } = req.body;

  const targetGroup = await utils.sequelize.findOne(db.groups, { where: { name } });
  const groupJSON = targetGroup.toJSON();
  const connectedUsers = await db.users.findAll({
    where: {
      groupId: groupJSON.id,
    },
  });
  await Promise.all(connectedUsers.map((connectedUser) => {
    // eslint-disable-next-line no-param-reassign
    connectedUser.groupId = null;
    return connectedUser.save();
  }));

  await targetGroup.destroy();
  return res.json('DELETE SUCESS');
};
