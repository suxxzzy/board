//버킷 내 객체를 삭제
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../../config/s3client');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
    try {
        console.log('삭제 요청');
        //객체의 실제 키 정보를 받는다.
        const { filename } = req.query;
        console.log(filename, '키 이름');

        if (!filename) {
            return res.status(400).json({ message: '키 이름이 없습니다' });
        }
        //버킷 정보
        const bucketParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
        };

        //s3에서 삭제
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: bucketParams.Bucket,
                Key: bucketParams.Key,
            }),
        );

        res.status(204).json({
            message: '서버가 s3에서 해당 첨부파일을 삭제했습니다',
        });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 첨부파일 삭제에 실패했습니다' });
    }
};
