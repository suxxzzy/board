const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { board } = initModels(sequelize);

module.exports = async (req, res) => {
    try {
        const { deletes } = req.body;
        console.log(deletes, '삭제할 게시물들');
        //삭제할 게시물 id가 없다면, 삭제 거부
        if (!deletes) {
            return res
                .status(400)
                .json({ message: '삭제할 게시물이 없습니다' });
        }

        //console.log(typeof deletes[0], '삭제할 게시물 데이터타입?');
        await board.update(
            { DISCD: 1 },
            {
                where: {
                    BID: deletes.map((el) => el.BID),
                },
            },
        );
        return res.status(204).json({ message: '게시물을 삭제했습니다' });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 게시물 삭제에 실패했습니다' });
    }
};
