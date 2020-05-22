const router = require('express').Router();
const { users } = require('../controller');

router.get('/', users.get);
router.post('/', users.post);

module.exports = router;
