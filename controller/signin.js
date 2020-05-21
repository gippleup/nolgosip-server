const utils = require('./utils');

module.exports = async (req, res) => {
  const {
    db,
  } = res;

  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).end('INVALID INPUT');
  }

  const existingUser = await utils.sequelize.findOne(db.users, {
    where: {
      email,
    },
  });

  const validLogin = existingUser ? existingUser.password === password : false;
  if (validLogin) {
    const token = await utils.jwt.sign(existingUser.email);
    const auth = await utils.jwt.sign(existingUser.auth);
    req.session.accessToken = token;
    req.session.auth = auth;
    // console.log(req.session);
    const resData = {
      leftVacation: existingUser.leftVacation,
      name: existingUser.name,
      mobile: existingUser.mobile,
      email: existingUser.email,
      auth: existingUser.auth,
      vacations: [],
    };
    return res.json(resData);
  }

  return res.end('NO DATA');
};
