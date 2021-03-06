const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { user, board, attachmentfile } = initModels(sequelize);
const { getCRTIME } = require('../../modules/datetimeconverter');

module.exports = async (req, res) => {
    try {
        //수정할 게시물의 BID
        const { id: BID } = req.params;
        const { title, content, attachmentfiles } = req.body;
        console.log(attachmentfiles, '첨부파일 정보목록');
        //예외처리
        if (!BID || !title || !content || attachmentfiles === undefined) {
            return res
                .status(400)
                .json({ message: '게시물 수정에 실패했습니다' });
        }

        //제목과 내용은 업데이트
        await board.update(
            {
                TITLE: title,
                CONTENT: content,
            },
            { where: { BID } },
        );

        const newPost = await board.findByPk(BID);

        //새롭게 올릴 첨부파일이 있는 경우 테이블에 등록해야 한다.
        if (attachmentfiles.length > 0) {
            attachmentfiles.map((file) => {
                file.BID = newPost.BID;
                file.CRTIME = getCRTIME();
            });

            //주어진 첨부파일 배열을 이용해 insert
            await attachmentfile.bulkCreate(attachmentfiles);
        }

        //수정된 내용 불러오기
        const modifiedBoard = await board.findByPk(BID, {
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
            message: `${BID}번 게시물을 수정했습니다`,
        });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 게시물 수정에 실패했습니다' });
    }
};
