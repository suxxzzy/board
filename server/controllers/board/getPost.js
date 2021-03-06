//게시물 하나의 상세 내용을 가지고 온다.
const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { user, board, attachmentfile } = initModels(sequelize);

module.exports = async (req, res) => {
    try {
        //게시물의 아이디를 받아와야 한다.
        const { id: BID } = req.params;
        if (!BID) {
            return res
                .status(400)
                .json({ message: '게시물 불러오기에 실패했습니다' });
        }

        //아이디가 존재하는 경우
        const Board = await board.findByPk(BID, {
            attributes: ['BID', 'TITLE', 'CONTENT', 'CRTIME', 'DISCD', 'UID'],
            include: [
                { model: user, attributes: ['USERID'], as: 'UID_user' },
                {
                    model: attachmentfile,
                    attributes: ['FILENAME', 'FILEPATH', 'EXT', 'SIZE'],
                    as: 'attachmentfiles',
                },
            ],
        });

        //만약에 삭제된 게시물인 경우, 삭제된 게시물입니다. 라고 응답
        if (Board.DISCD !== 0) {
            return res.status(404).json({ message: '삭제된 게시물입니다' });
        }

        //존재하는 게시물의 경우
        //게시물 제목, 작성자 아이디, 작성 시각, 작성한 내용,
        // 첨부파일(클릭하면 파일 다운받을 수 있음)

        //조회수 1 올려야 함
        board.increment('VIEWCOUNT', {
            by: 1,
            where: { BID },
        });

        return res.status(200).json({
            data: { Board },
            message: `${BID}번 게시물을 가져왔습니다`,
        });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 게시물 불러오기에 실패했습니다' });
    }
};
