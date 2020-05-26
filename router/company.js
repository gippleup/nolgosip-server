const router = require('express').Router();
const { company } = require('../controller');

router.get('/', company.get);
router.post('/', company.post);

module.exports = router;
