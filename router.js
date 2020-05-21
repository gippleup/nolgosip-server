const router = require('express').Router();
const controller = require('./controller');

router.get('/', (req, res) => {
  res.end();
});

router.use('/signup', controller.signup);

router.use('/signin', controller.signin);

router.use('/signout', controller.signout);

router.use('/vacation', controller.vacation);

router.use('/department', controller.department);

router.use('/employee', controller.employee);

module.exports = router;
