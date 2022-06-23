//클라이언트의 파일 다운로드 요청에 의해
//한시적으로만 get요청(다운로드 요청)을 허용하는 url을 발급함

//const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
//const { s3Client } = require('../../config/s3client');
//const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
//import { Readable } from 'stream';
//const { createWriteStream } = require('fs');
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

        res.attachment(key);
        const fileStream = s3.getObject(options).createReadStream();
        fileStream.pipe(res);
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 presigned URL생성에 실패했습니다' });
    }
};
