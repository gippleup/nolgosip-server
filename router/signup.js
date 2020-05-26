const router = require('express').Router();
const { signup } = require('../controller');

router.post('/', signup);

module.exports = router;
