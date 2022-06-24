//클라이언트의 파일 업로드 요청에 의해
//presignedurl을 발급하여 반환하는 컨트롤러.
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../../config/s3client');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
    try {
        //파일 이름과 확장자
        const { filename } = req.query;

        if (!filename) {
            return res
                .status(400)
                .json({ message: '파일명과 확장자가 없습니다' });
        }

        //버킷 정보
        const bucketParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${Math.ceil(Math.random() * 10 ** 10)}-${filename}`,
        };

        //파일 업로드 url 생성
        const command = new PutObjectCommand(bucketParams);

        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
        });

        return res.status(200).json({
            data: { signedUrl },
            message: 'presigned URL을 생성했습니다',
        });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 presigned URL생성에 실패했습니다' });
    }
};
