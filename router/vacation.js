const router = require('express').Router();
const { vacation } = require('../controller');

router.get('/', (req, res) => {
  res.status(404).end();
});

router.post('/', vacation.post);

module.exports = router;
