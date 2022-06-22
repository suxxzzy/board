const express = require('express');
const router = express.Router();
const isAuth = require('../middlewares/Authentication');
const board = require('../controllers/board/index');

router.get('/search', board.search);
router.get('/presignedurl', board.getUrl);
router.get('/', board.getPage);
router.get('/:id', board.getPost);
router.post('/', isAuth, board.post);

router.patch('/:id', isAuth, board.patch);
// //여러개를 삭제할 수도 있음: 그래서 patch 사용.
router.patch('/', isAuth, board.delete);

module.exports = router;
