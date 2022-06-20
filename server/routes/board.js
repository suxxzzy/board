const express = require('express');
const router = express.Router();

const board = require('../controllers/board/index');

router.get('/search', board.search);
router.get('/', board.getPage); //이거때문에 여기로 요청 들어온 거임..
router.get('/:id', board.getPost);
// router.post('/', board.post);
// router.patch('/:id', board.patch);
// //여러개를 삭제할 수도 있음
// router.delete('/:id', board.delete);

module.exports = router;
