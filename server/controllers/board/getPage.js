//단일 페이지별 게시글을 페이지당 10개씩 가지고온다.
const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { user, board } = initModels(sequelize);
const { Op } = require('sequelize');

module.exports = async (req, res) => {
    try {
        const { title, author, page } = req.query;
        if (!page) {
            return res.status(400).json({ message: '페이지 번호가 없습니다' });
        }
        //**삭제된 게시물은 가지고 오지 말 것 */
        //검색 없이 게시물 요청한 경우
        if (!title && !author) {
            const { rows } = await board.findAndCountAll({
                where: { DISCD: 0 },
                attributes: ['BID', 'TITLE', 'CRTIME', 'VIEWCOUNT'],
                include: [
                    { model: user, attributes: ['USERID'], as: 'UID_user' },
                ],
                offset: (page - 1) * 10,
                limit: 10,
                order: [['CRTIME', 'DESC']],
            });
            console.log('게시물 목록 배열', rows);
            return res.status(200).json({
                data: { board: rows },
                message: `${page}페이지 게시물을 가져왔습니다`,
            });
        }
        //검색 조건: 제목
        if (title) {
            const { rows } = await board.findAndCountAll({
                where: { DISCD: 0, TITLE: { [Op.like]: `%${title}%` } },
                attributes: ['BID', 'TITLE', 'CRTIME', 'VIEWCOUNT'],
                include: [
                    { model: user, attributes: ['USERID'], as: 'UID_user' },
                ],
                offset: (page - 1) * 10,
                limit: 10,
                order: [['CRTIME', 'DESC']],
            });
            console.log('게시물 목록 배열', rows);
            return res.status(200).json({
                data: { board: rows },
                message: `${page}페이지 게시물을 가져왔습니다`,
            });
        }
        //검색 조건: 작성자
        if (author) {
            //작성자 아이디를 바탕으로 작성자의 pk값을 찾는다
            const writer = await user.findOne({ where: { USERID: author } });
            const { rows } = await board.findAndCountAll({
                where: { DISCD: 0, UID: writer.UID },
                attributes: ['BID', 'TITLE', 'CRTIME', 'VIEWCOUNT'],
                include: [
                    { model: user, attributes: ['USERID'], as: 'UID_user' },
                ],
                offset: (page - 1) * 10,
                limit: 10,
                order: [['CRTIME', 'DESC']],
            });
            console.log('게시물 목록 배열', rows);
            return res.status(200).json({
                data: { board: rows },
                message: `${page}페이지 게시물을 가져왔습니다`,
            });
        }
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 게시물 불러오기에 실패했습니다' });
    }
};
