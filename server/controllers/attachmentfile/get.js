const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
    try {
        //키가 없는 경우
        const { key } = req.query;
        if (!key) {
            return res.status(400).json({ message: '키가 없습니다' });
        }

        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.S3_REGION,
        });

        const s3 = new AWS.S3();
        const options = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        };

        //파일 읽어들이고 클라이언트에게 전송
        res.attachment(key);
        const fileStream = s3.getObject(options).createReadStream();
        fileStream.pipe(res);
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 파일 전송에 실패했습니다' });
    }
};
