const router = require('express').Router();
const { signin } = require('../controller');

router.post('/', signin);

module.exports = router;
