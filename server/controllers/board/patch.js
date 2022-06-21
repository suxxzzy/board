const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { board } = initModels(sequelize);

module.exports = async (req, res) => {
    try {
        //수정할 게시물의 BID
        const { id } = req.params;
        const { title, content } = req.body;
        //만약에 이게 주어지지 않을 경우 에러
        if (!id || !title || !content) {
            return res
                .status(400)
                .json({ message: '게시물 수정에 실패했습니다' });
        }

        //
        console.log(title, content, '수정할 내용');
        return res
            .status(204)
            .json({ data: {}, message: '수정 완료하였습니다' });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 게시물 수정에 실패했습니다' });
    }
};
