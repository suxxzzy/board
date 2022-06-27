const express = require('express');
const router = express.Router();

const user = require('../controllers/user/index');
const isAuth = require('../middlewares/Authentication');

router.post('/userid', user.userid); //아이디 중복 체크
router.post('/signup', user.signup);
router.post('/login', user.login);
router.post('/logout', isAuth, user.logout);

module.exports = router;
