const utils = require('./utils');

module.exports = async (req, res) => {
  const {
    db,
  } = res;

  const {
    email,
    password,
  } = req.body;

  if (!email || !password) return res.endWithMessage(400, 'INVALID INPUT');

  const existingUser = await db.users.findOne({
    where: {
      email,
    },
    include: db.companies,
  });

  if (!existingUser) return res.endWithMessage(400, 'NO SUCH USER');
  const userJSON = existingUser.toJSON();

  const validLogin = userJSON.password === password;
  if (validLogin) {
    const token = await utils.jwt.sign(userJSON.email);
    const auth = await utils.jwt.sign(userJSON.auth);
    req.session.accessToken = token;
    req.session.auth = auth;
    res.cookie('accessToken', token, {
      sameSite: 'none',
    });
    // console.log(req.session);
    const resData = {
      leftVacation: userJSON.leftVacation,
      name: userJSON.name,
      mobile: userJSON.mobile,
      email: userJSON.email,
      auth: userJSON.auth,
      vacations: [],
    };
    return res.json(resData);
  }

  return res.endWithMessage(404, 'NO SUCH USER');
};
