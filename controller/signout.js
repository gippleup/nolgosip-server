module.exports = async (req, res) => {
  if (!req.session.accessToken) res.json({ msg: 'no-session' });
  req.session.destroy();
  res.end('ok');
};
