const { S3Client } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
dotenv.config();
//리전
const REGION = process.env.S3_REGION;
//s3 클라이언트 객체 생성
const s3Client = new S3Client({ region: REGION });
module.exports = { s3Client };
