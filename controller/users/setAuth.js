const utils = require('../utils');

module.exports = async (req, res) => {
  const { auth, email } = req.body;
  const { db } = res;

  if (!auth || !email) return res.endWithMessage(400, 'INVALID INPUT');
  if (auth !== 'manager' && auth !== 'user') return res.endWithMessage(400, 'INVALID AUTH TYPE');

  const sessionAuth = await utils.jwt.verify(req.session.auth, (err, decoded) => {
    if (err) return false;
    return decoded.data;
  });
  if (!sessionAuth || sessionAuth === 'user') return res.endWithMessage(400, 'UNAUTHORIZED REQUEST');

  const existingUser = await utils.sequelize.findOne(db.users, {
    where: {
      email,
    },
  });
  if (!existingUser) return res.endWithMessage(400, 'NO SUCH USER');

  existingUser.auth = auth;
  const userJSON = existingUser.toJSON();

  if (userJSON.auth === 'manager' && userJSON.groupId) {
    const curGroup = await db.groups.findOne({ where: { id: userJSON.groupId } });
    curGroup.managerId = userJSON.id;
    curGroup.save();
  }

  const resData = {
    email: userJSON.email,
    name: userJSON.name,
    auth: userJSON.auth,
  };
  await existingUser.save();
  return res.json(resData);
};
