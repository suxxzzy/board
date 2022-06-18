const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const boardRouter = require('./board');

router.use('/user', userRouter);
router.use('/board', boardRouter);

module.exports = router;
