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

  const allUsers = await utils.sequelize.findAll(db.users, { where: {} });
  const usersJSON = allUsers.map((el) => el.toJSON());
  const tableIsEmpty = usersJSON.length === 0;

  const createUser = async (values) => db.users.create(values);

  const existingUser = await utils.sequelize.findOne(db.users, { where: { email } });

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

  const newUser = await createUser(values)
    .catch((err) => setTimeout(()=>{console.log(err)}, 1000));

  return res.json(newUser);
};
