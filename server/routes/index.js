const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const boardRouter = require('./board');
const attachmentfileRouter = require('./attachmentfile');

router.use('/user', userRouter);
router.use('/board', boardRouter);
router.use('/attachmentfile', attachmentfileRouter);

module.exports = router;
