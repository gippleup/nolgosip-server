const router = require('express').Router();
const { signout } = require('../controller');

router.post('/', signout);

module.exports = router;
