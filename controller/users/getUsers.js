const utils = require('../utils');

module.exports = async (req, res) => {
  const { db } = res;
  const auth = await utils.jwt.verify(req.session.auth, (err, decoded) => {
    if (err) return false;
    return decoded.data;
  });
  if (!auth || auth !== 'admin') return res.end('UNAUTHORIZED REQUEST');

  const userList = await utils.sequelize.findAll(db.users, { where: {}, include: [db.groups] });
  const usersJSON = userList.map((user) => user.toJSON());
  const filteredData = usersJSON.map((user) => {
    const filtered = {
      id: user.id,
      auth: user.auth,
      totalVacation: user.totalVacation,
      email: user.email,
    };
    return filtered;
  });
  return res.json(userList);
};
