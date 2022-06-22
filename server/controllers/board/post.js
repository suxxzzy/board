const { sequelize } = require('../../models/index');
const initModels = require('../../models/init-models');
const { user, board, attachmentfile } = initModels(sequelize);
const { getCRTIME } = require('../../modules/datetimeconverter');

//제목, 내용, 작성자 아이디(쿠키), 첨부파일 링크 받아서 저장.
module.exports = async (req, res) => {
    try {
        const { id } = req;
        const { title, content, attachmentfiles } = req.body;

        console.log(id, title, content, '등록할 게시물 내용');

        if (!title || !content || attachmentfiles === undefined) {
            return res
                .status(400)
                .json({ message: '게시물 등록에 실패했습니다' });
        }

        //사용자 아이디 가지고 오기
        const author = await user.findByPk(id);

        //제목, 내용, 작성 시각, 조회수를 테이블에 insert
        const newPost = await board.create({
            UID: id,
            TITLE: title,
            CONTENT: content,
            CRTIME: getCRTIME(),
            VIEWCOUNT: 0,
        });

        console.log(newPost.BID, '게시물 BID');

        //첨부파일이 없는 경우
        if (attachmentfiles.length === 0) {
            return res.status(201).json({
                data: {
                    BID: newPost.BID,
                    USERID: author.UID,
                    TITLE: newPost.TITLE,
                    CONTENT: newPost.CONTENT,
                    CRTIME: newPost.CRTIME,
                    ATTACHMENTFILES: [],
                },
                message: '게시글 등록에 성공했습니다',
            });
        }

        //만약에, 첨부파일이 존재한다면, attachmentfile 테이블에도 insert수행해야 한다. bulk insert!
        //추가로 들어가야 할 정보: BID, CRTIME
        attachmentfiles.map((file) => {
            file.BID = newPost.BID;
            file.CRTIME = getCRTIME();
        });

        console.log(attachmentfiles, '변경');

        await attachmentfile.bulkCreate(attachmentfiles);

        res.status(201).json({
            data: {
                BID: newPost.BID,
                USERID: author.UID,
                TITLE: newPost.TITLE,
                CONTENT: newPost.CONTENT,
                CRTIME: newPost.CRTIME,
                ATTACHMENTFILES: attachmentfiles,
            },
            message: '게시글 등록에 성공했습니다',
        });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 게시물 등록에 실패했습니다' });
    }
};
