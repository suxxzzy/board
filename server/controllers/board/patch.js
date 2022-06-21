const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { user, board, attachmentfile } = initModels(sequelize);

module.exports = async (req, res) => {
    try {
        //수정할 게시물의 BID
        const { id: postID } = req.params;
        const { title, content } = req.body;
        //만약에 이게 주어지지 않을 경우 에러
        if (!postID || !title || !content) {
            return res
                .status(400)
                .json({ message: '게시물 수정에 실패했습니다' });
        }

        //
        console.log(title, content, '수정할 내용');
        await board.update(
            {
                TITLE: title,
                CONTENT: content,
            },
            { where: { BID: postID } },
        );

        const modifiedBoard = await board.findByPk(postID, {
            attributes: ['BID', 'TITLE', 'CONTENT', 'CRTIME', 'DISCD', 'UID'],
            include: [
                { model: user, attributes: ['USERID'], as: 'UID_user' },
                {
                    model: attachmentfile,
                    attributes: ['FILENAME', 'FILEPATH', 'EXT'],
                    as: 'attachmentfiles',
                },
            ],
        });
        return res.status(204).json({
            data: { post: modifiedBoard },
            message: `${postID}번 게시물을 수정했습니다`,
        });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 게시물 수정에 실패했습니다' });
    }
};
