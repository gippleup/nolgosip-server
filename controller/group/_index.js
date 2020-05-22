const utils = require('../utils');
const createGroup = require('./createGroup');
const getGroup = require('./getGroups');
const deleteGroup = require('./deleteGroup');
const modifyGroup = require('./modifyGroup');

module.exports = {
  get: getGroup,
  post: async (req, res) => {
    const { type } = req.body;
    const { db } = res;

    const token = utils.jwt.verify(req.session.accessToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });

    if (!token) return res.end('INVALID TOKEN');

    const curUser = await utils.sequelize.findOne(db.users, { where: { email: token } });
    const userJSON = curUser.toJSON();

    if (userJSON.auth !== 'admin') return res.end('UNAUTHORIZED USER');

    if (type === 'create') return createGroup(req, res);
    if (type === 'delete') return deleteGroup(req, res);
    if (type === 'modify') return modifyGroup(req, res);

    return res.end('UNHANDLED REQUEST');
  },
};
