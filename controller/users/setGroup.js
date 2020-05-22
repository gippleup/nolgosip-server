const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;
  const { groupName, userEmail } = req.body;
  if (!groupName) return res.end('INVALID INPUT');

  const token = await utils.jwt.verify(req.session.accessToken, (err, decoded) => {
    if (err) return false;
    return decoded.data;
  });

  if (!token) return res.end('INVALID TOKEN');

  const curUser = await utils.sequelize.findOne(db.users, { where: { email: token } });
  if (!curUser) return res.end("REQUESTING USER DOESN'T EXIST");
  if (curUser.toJSON().auth !== 'admin') return res.end('UNAUTHORIZED USER');

  const group = await utils.sequelize.findOne(db.groups, { where: { name: groupName } });
  if (!group) return res.end("SUCH GROUP DOESN'T EXIST");

  const targetUser = await utils.sequelize.findOne(db.users, { where: { email: userEmail } });
  const userJSON = targetUser.toJSON();
  if (!userJSON) return res.end("REQUESTED USER DOESN'T EXIST");

  if (userJSON.auth === 'manager') {
    group.managerId = userJSON.id;
    group.save();
  }

  targetUser.groupId = group.toJSON().id;
  await targetUser.save();

  res.json(targetUser);
};
