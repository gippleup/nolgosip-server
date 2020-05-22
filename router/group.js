const router = require('express').Router();
const { group } = require('../controller');

router.get('/', group.get);
router.post('/', group.post);

module.exports = router;
