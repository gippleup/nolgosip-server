const utils = require('../utils');
const requestVacation = require('./manageVacation/requestVacation');
const cancleVacation = require('./manageVacation/cancelVacation');
const approveVacation = require('./manageVacation/approveVacation');
const revertVacation = require('./manageVacation/revertVacation');
const getVacation = require('./getVaction');

module.exports = {
  post: async (req, res) => {
    const { db } = res;
    const { type } = req.body;

    if (!type) return res.endWithMessage('TYPE IS NOT SPECIFIED');

    const token = await utils.jwt.verify(req.session.accessToken, (err, decoded) => {
      if (err) return false;
      return decoded.data;
    });

    if (!token) return res.endWithMessage('INVALID TOKEN');

    const curUser = await db.users.findOne({ where: { email: token } });
    const userJSON = curUser.toJSON();
    if (!userJSON) return res.endWithMessage('INVALID USER');

    if (type === 'get') return getVacation(req, res, userJSON);
    if (type === 'request') return requestVacation(req, res, userJSON);
    if (type === 'cancel' || type === 'decline') return cancleVacation(req, res, userJSON);
    if (type === 'approve') return approveVacation(req, res, userJSON);
    if (type === 'revert') return revertVacation(req, res, userJSON);

    return res.endWithMessage('SOMETHING WENT WRONG: VACATION POST');
  },
};
