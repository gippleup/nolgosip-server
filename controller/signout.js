const utils = require('./utils');

module.exports = async (req, res) => {
  if (!req.session.accessToken) return res.endWithMessage(400, 'NO SESSION');
  req.session.destroy();
  res.clearCookie('accessToken');
  return res.end('ok');
};
