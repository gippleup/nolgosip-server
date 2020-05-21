const utils = require('./utils');

module.exports = async (req, res) => {
  const {
    db,
  } = res;

  const {
    email,
    password,
  } = req.body;

  const existingUser = await utils.sequelize.findOne(db.users, {
    where: {
      email,
    },
  });

  const validLogin = existingUser ? existingUser.password === password : false;
  if (validLogin) {
    const token = await utils.jwt.sign(email);
    req.session.accessToken = token;
    return res.json(existingUser);
  }
  return res.end('일치하는 회원 정보가 없습니다.');
};
