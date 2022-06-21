//단일 페이지별 게시글을 페이지당 10개씩 가지고온다.
const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { user, board } = initModels(sequelize);

module.exports = async (req, res) => {
    try {
        const { page } = req.query;
        if (!page) {
            return res.status(400).json({ message: '페이지 번호가 없습니다' });
        }
        //**삭제된 게시물은 가지고 오지 말 것 */
        const { count, rows } = await board.findAndCountAll({
            where: { DISCD: 0 },
            attributes: ['BID', 'TITLE', 'CRTIME', 'VIEWCOUNT', 'UID'],
            include: [{ model: user, attributes: ['USERID'], as: 'UID_user' }],
            offset: (Number(page) - 1) * 10,
            limit: 10,
            order: [['CRTIME', 'DESC']],
        });
        return res.status(200).json({
            data: { board: rows, count },
            message: `${page}페이지 게시물을 가져왔습니다`,
        });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 게시물 불러오기에 실패했습니다' });
    }
};
