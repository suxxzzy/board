const express = require('express');
const router = express.Router();
const attachmentfile = require('../controllers/attachmentfile/index');
const isAuth = require('../middlewares/Authentication');

router.get('/presignedurl', isAuth, attachmentfile.upload); //업로드
router.get('/object', attachmentfile.download); //다운로드
router.delete('/', isAuth, attachmentfile.delete); //삭제

module.exports = router;
