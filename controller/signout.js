module.exports = async (req, res) => {
  if (!req.session.accessToken) res.status(400).json({ msg: 'no-session' });
  req.session.destroy();
  res.clearCookie('accessToken');
  res.end('ok');
};
