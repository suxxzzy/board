//버킷 내 객체를 삭제
const { DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../../config/s3client');
const { attachmentfile } = require('../../models/index');
const dotenv = require('dotenv');
dotenv.config();

//하나 또는 여러 개의 object를 지운다. object의 key는 배열로 받는다.
module.exports = async (req, res) => {
    try {
        console.log('삭제 요청');
        //객체의 실제 키 정보를 받는다.
        const { deletes } = req.body;

        console.log(deletes, '삭제할 객체 정보');

        if (!deletes) {
            return res.status(400).json({ message: '키 이름이 없습니다' });
        }

        //수정 시 첨부파일은 삭제하지 않은 경우
        if (deletes.length === 0) {
            return res.status(200).json({ message: '삭제할 파일이 없습니다' });
        }

        //버킷 정보
        const bucketParams = {
            Bucket: process.env.BUCKET_NAME,
            Delete: {
                Objects: deletes,
            },
        };

        const delPromise = [];

        //s3에서 삭제
        const s3Promise = s3Client.send(new DeleteObjectsCommand(bucketParams));
        delPromise.push(s3Promise);

        //db에서 삭제
        const delList = deletes.map((del) => del.Key);
        for (let i = 0; i < delList.length; i++) {
            delPromise.push(
                attachmentfile.destroy({ where: { FILEPATH: delList[i] } }),
            );
        }

        Promise.all(delPromise).then((result) => {
            res.status(204).json({
                message: '서버가 해당 첨부파일을 삭제했습니다',
            });
        });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 첨부파일 삭제에 실패했습니다' });
    }
};
