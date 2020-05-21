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

  if (!email || !name || !password || !mobile) {
    return res.status(400).end('INVALID INPUT');
  }

  const tableIsEmpty = await utils.sequelize.findOne(db.users, { where: {} }) === false;

  const createUser = (values) => db.users.create(values);

  const existingUser = await utils.sequelize.findOne(db.users, {
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.end('duplicate');
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
