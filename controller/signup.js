const utils = require('./utils');

module.exports = async (req, res) => {
  const {
    db,
  } = res;

  const {
    email,
    name,
    password,
    mobile,
  } = req.body;

  const tableIsEmpty = await utils.sequelize.findOne(db.users, { where: {} }) === false;

  const createUser = (values) => db.users.create(values);

  const existingUser = await utils.sequelize.findOne(db.users, {
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.end(`"${email}"은 이미 등록된 이메일입니다.`);
  }

  const values = {
    name,
    email,
    password,
    mobile,
  };

  values.auth = tableIsEmpty ? 'admin' : 'user';

  return createUser(values)
    .then((data) => {
      // res.send(data.toJSON());
      res.end('ok');
    })
    .catch((err) => {
      const errors = err.errors.map((error) => error.message);
      res.send(errors.join('\n'));
    });
};
