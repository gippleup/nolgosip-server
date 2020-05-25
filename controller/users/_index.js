const setAuth = require('./setAuth');
const getUsers = require('./getUsers');
const setGroup = require('./setGroup');
const deleteGroup = require('./deleteGroup');

module.exports = {
  get: getUsers,
  post: (req, res) => {
    const { type } = req.body;
    if (!type) return res.end('TYPE IS NOT SPECIFIED');
    if (type === 'setAuth') return setAuth(req, res);
    if (type === 'setGroup') return setGroup(req, res);
    if (type === 'deleteGroup' || type === 'exitGroup') return deleteGroup(req, res);
    return res.end('no action');
  },
};
