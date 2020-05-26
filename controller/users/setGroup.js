const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;
  const { groupName, userEmail } = req.body;
  if (!groupName || !userEmail) return res.endWithMessage(400, 'INVALID INPUT');

  const token = await utils.jwt.verify(req.session.accessToken, (err, decoded) => {
    if (err) return false;
    return decoded.data;
  });

  if (!token) return res.endWithMessage(400, 'INVALID TOKEN');

  const curUser = await utils.sequelize.findOne(db.users, { where: { email: token } });
  if (!curUser) return res.endWithMessage(400, "REQUESTING USER DOESN'T EXIST");
  if (curUser.toJSON().auth !== 'admin') return res.endWithMessage(400, 'UNAUTHORIZED USER');

  const group = await utils.sequelize.findOne(db.groups, { where: { name: groupName } });
  if (!group) return res.endWithMessage(400, "SUCH GROUP DOESN'T EXIST");

  const targetUser = await utils.sequelize.findOne(db.users, { where: { email: userEmail } });
  if (!targetUser) return res.endWithMessage(400, 'NO SUCH USER');
  const userJSON = targetUser.toJSON();

  if (userJSON.auth === 'manager') {
    group.managerId = userJSON.id;
    group.save();
  }

  targetUser.groupId = group.toJSON().id;
  await targetUser.save();

  res.json(targetUser);
};
