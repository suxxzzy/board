const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { user, board, attachmentfile } = initModels(sequelize);
const { getCRTIME } = require('../../modules/datetimeconverter');

//제목, 내용, 작성자 아이디(쿠키), 첨부파일 링크 받아서 저장.
module.exports = async (req, res) => {
    try {
        const { id } = req;
        const { title, content } = req.body;

        console.log(id, title, content, '등록할 게시물 내용');

        if (!title || !content) {
            return res
                .status(400)
                .json({ message: '제목과 내용 모두 입력해주세요' });
        }

        //사용자 이름 가지고 오기
        const author = await user.findByPk(id);

        //제목, 내용, 작성 시각,조회수를 테이블에 insert
        const newPost = await board.create({
            UID: id,
            TITLE: title,
            CONTENT: content,
            CRTIME: getCRTIME(),
            VIEWCOUNT: 0,
        });

        //첨부 파일의 존재 여부: 어떻게 알아낼래?
        let hasAttachmentfiles = false;

        //만약에, 첨부파일이 존재한다면, attachmentfile 테이블에도 insert수행해야 한다. bulk insert!
        //들어가야 할 정보: BID, FILENAME, FILEPATH, EXT, SIZE, CRTIME

        return res.status(201).json({
            data: {
                BID: newPost.BID,
                USERID: author.UID,
                TITLE: newPost.TITLE,
                CONTENT: newPost.CONTENT,
                CRTIME: newPost.CRTIME,
                ATTACHMENTFILES: hasAttachmentfiles ? [] : 'array of file info',
            },
            message: '게시글 등록에 성공했습니다',
        });

        //만약에, 첨부한 파일이 있다면, 링크를 받아서 attachmentfile 테이블에 저장해야 한다
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 게시물 등록에 실패했습니다' });
    }
};
