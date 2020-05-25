const router = require('express').Router();

router.get('/', (req, res) => {
  res.end('ok');
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/signout', require('./signout'));
router.use('/group', require('./group'));
router.use('/vacation', require('./vacation'));
router.use('/users', require('./users'));
// router.use('/company', require('./company'));

module.exports = router;
