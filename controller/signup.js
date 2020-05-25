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
    return res.status(400).send('INVALID INPUT');
  }

  const allUsers = await db.users.findAll({ where: {} });
  const usersJSON = allUsers.map((el) => el.toJSON());
  const tableIsEmpty = usersJSON.length === 0;

  const createUser = async (values) => db.users.create(values);

  const existingUser = await db.users.findOne({ where: { email } })
    .catch((err) => {
      throw err;
    });

  if (existingUser) {
    return res.status(400).end('duplicate');
  }

  const values = {
    name,
    email,
    password,
    mobile,
  };


  values.auth = tableIsEmpty ? 'admin' : 'user';

  const newUser = await createUser(values);

  return res.json(newUser);
};
