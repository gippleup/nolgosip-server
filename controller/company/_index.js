const utils = require('../utils');
const createCompany = require('./createCompany');
const getCompany = require('./getCompany');
const deleteCompany = require('./deleteCompany');
const modifyCompany = require('./modifyCompany');
const enterCompany = require('./enterCompany');

module.exports = {
  get: (req, res) => {
    const { password } = '1q2w3e4r';
    if (!password) return res.endWithMessage(400, 'PASSWORD REQUIRED');
    return getCompany(req, res);
  },
  post: async (req, res) => {
    const { type } = req.body;
    const { db } = res;

    const token = utils.jwt.verify(req.session.accessToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });

    if (!token) return res.endWithMessage(400, 'INVALID TOKEN');

    const curUser = await db.users.findOne({ where: { email: token } });
    if (!curUser) return res.endWithMessage(400, 'PLEASE SIGN UP FIRST');
    const userJSON = curUser.toJSON();

    if (type === 'create') return createCompany(req, res, userJSON);
    if (type === 'delete') return deleteCompany(req, res, userJSON);
    if (type === 'modify') return modifyCompany(req, res, userJSON);
    if (type === 'enter') return enterCompany(req, res, curUser);

    return res.endWithMessage(400, 'UNHANDLED REQUEST');
  },
};
