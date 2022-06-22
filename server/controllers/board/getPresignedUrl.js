//클라이언트의 파일 업로드 요청에 의해
//presignedurl을 발급하여 반환하는 컨트롤러.
const {
    CreateBucketCommand,
    DeleteObjectCommand,
    PutObjectCommand,
    DeleteBucketCommand,
} = require('@aws-sdk/client-s3');

const { s3Client } = require('../../config/s3client');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
    console.log('url 발급 요청');
    try {
        //파일 이름을 req.body에 담아줌
        const { filename, ext } = req.query;
        console.log(filename, ext);

        //버킷 정보 설정
        const bucketParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${Math.ceil(Math.random() * 10 ** 10)}${filename}${ext}`,
        };

        console.log(bucketParams, '버켓파람스');

        //파일 업로드를 하는 것이므로
        const command = new PutObjectCommand(bucketParams);

        console.log('command:', command);

        //url 생성
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
        });

        console.log(signedUrl, '업로드 할 수 있는 url은??');

        return res.status(200).json({
            data: { signedUrl },
            message: 'presigned URL을 생성했습니다',
        });
    } catch (err) {
        console.log('Error creating presigned URL', err);
    }
};
