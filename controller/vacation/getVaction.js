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

  if (!target) return res.status(400).end('TARGET IS NOT SPECIFIED');
  if (!email) return res.status(400).end('TARGET EMAIL IS NOT SPECIFIED');
  if (!from) return res.status(400).end('SPAN IS NOT SPECIFIED');
  if (!to) return res.status(400).end('SPAN IS NOT SPECIFIED');

  const token = await utils.jwt.verify(req.session.accessToken, (err, decoded) => {
    if (err) return false;
    return decoded.data;
  });

  if (!token) return res.end('INVALID TOKEN');

  if (target === 'team') return getTeamVacation(req, res, token);
  if (target === 'user') return getUserVacation(req, res, token);

  return res.end('UNHANDLED REQUEST');
};
