//단일 페이지별 게시글을 페이지당 10개씩 가지고온다.
const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { user, board } = initModels(sequelize);
const { Op } = require('sequelize');

module.exports = async (req, res) => {
    try {
        const { option, keyword, page } = req.query;

        if (!page) {
            return res.status(400).json({ message: '페이지 번호가 없습니다' });
        }

        //검색 조건: 제목
        if (option === 'title') {
            //키워드가 없을 경우
            if (!keyword) {
                return res
                    .status(400)
                    .json({ message: '검색할 제목을 입력해주세요' });
            }
            const { count, rows } = await board.findAndCountAll({
                where: { DISCD: 0, TITLE: { [Op.like]: `%${keyword}%` } },
                attributes: ['BID', 'TITLE', 'CRTIME', 'VIEWCOUNT', 'UID'],
                include: [
                    { model: user, attributes: ['USERID'], as: 'UID_user' },
                ],
                offset: (Number(page) - 1) * 10,
                limit: 10,
                order: [['CRTIME', 'DESC']],
            });

            return res.status(200).json({
                data: { board: rows, count },
                message: `${page}페이지 게시물을 가져왔습니다`,
            });
        }

        //검색 조건: 작성자
        if (option === 'author') {
            //키워드가 없을 경우
            if (!keyword) {
                return res
                    .status(400)
                    .json({ message: '검색할 작성자명을 입력해주세요' });
            }

            const { count, rows } = await board.findAndCountAll({
                where: { DISCD: 0 },
                attributes: ['BID', 'TITLE', 'CRTIME', 'VIEWCOUNT', 'UID'],
                include: [
                    {
                        model: user,
                        attributes: ['USERID'],
                        as: 'UID_user',
                        where: { USERID: { [Op.like]: `%${keyword}%` } },
                    },
                ],
                offset: (Number(page) - 1) * 10,
                limit: 10,
                order: [['CRTIME', 'DESC']],
            });
            return res.status(200).json({
                data: { board: rows, count },
                message: `${page}페이지 게시물을 가져왔습니다`,
            });
        }
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 검색결과 불러오기에 실패했습니다' });
    }
};
