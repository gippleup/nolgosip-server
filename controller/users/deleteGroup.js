const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;
  const { userEmail } = req.body;
  if (!userEmail) return res.endWithMessage(400, 'INVALID INPUT');

  const token = await utils.jwt.verify(req.session.accessToken, (err, decoded) => {
    if (err) return false;
    return decoded.data;
  });

  if (!token) res.endWithMessage(400, 'INVALID TOKEN');

  const curUser = await utils.sequelize.findOne(db.users, { where: { email: token } });
  if (!curUser) return res.endWithMessage(400, "REQUESTING USER DOESN'T EXIST");
  if (curUser.toJSON().auth !== 'admin') return res.endWithMessage(400, 'UNAUTHORIZED REQUEST');

  const targetUser = await utils.sequelize.findOne(db.users, { where: { email: userEmail } });
  if (!targetUser) return res.endWithMessage(400, 'NO SUCH USER');
  const userJSON = targetUser.toJSON();

  if (userJSON.auth === 'manager') {
    const curGroup = await db.groups.findOne({ where: { id: userJSON.groupId } });
    curGroup.managerId = null;
    await curGroup.save();
  }

  targetUser.groupId = null;
  await targetUser.save();

  const newData = targetUser.toJSON();

  const filteredData = utils.objInclude(newData, ['auth', 'email', 'mobile', 'name']);

  return res.json(filteredData);
};
