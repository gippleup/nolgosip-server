const utils = require('../utils');
const getTeamVacation = require('./getVacation/getTeamVacation');
const getUserVacation = require('./getVacation/getUserVacation');

module.exports = async (req, res, userJSON) => {
  const {
    target,
    email,
    from,
    to,
  } = req.body;

  if (!target) return res.endWithMessage(400, 'TARGET IS NOT SPECIFIED');
  if (!from) return res.endWithMessage(400, 'SPAN IS NOT SPECIFIED');
  if (!to) return res.endWithMessage(400, 'SPAN IS NOT SPECIFIED');

  const token = await utils.jwt.verify(req.session.accessToken, (err, decoded) => {
    if (err) return false;
    return decoded.data;
  });

  if (!token) return res.endWithMessage(400, 'INVALID TOKEN');

  if (target === 'team') return getTeamVacation(req, res, userJSON);
  if (target === 'user') return getUserVacation(req, res, userJSON);

  return res.endWithMessage(400, 'UNHANDLED REQUEST');
};
