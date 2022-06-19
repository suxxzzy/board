const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const { sequelize } = require('./models/index');

const app = express();
const port = process.env.PORT || 80;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

//데이터베이스 연결
sequelize
    .sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });

app.use(express.json()); // json 파싱
app.use(express.urlencoded({ extended: false })); // uri 파싱
app.use(cors(corsOptions));
app.use(cookieParser());

//모든 루트 요청은 indexRouter로!
app.use('/', indexRouter);

//배포 환경에서 정상 응답 받는지 테스트하는 코드
app.get('/', (req, res) => {
    res.send('hello world');
});

//일부러 에러 발생시키기 테스트
app.use((req, res, next) => {
    res.status(404).send('error!!');
});

//서버에러
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        message: 'Internal Server Error',
        stacktrace: err.toString(),
    });
});

https
    .createServer(
        {
            key: fs.readFileSync(__dirname + '/localhost+2-key.pem', 'utf-8'),
            cert: fs.readFileSync(__dirname + '/localhost+2.pem', 'utf-8'),
        },
        app,
    )
    .listen(port, () => {
        console.log(`${port}번 포트에서 대기중`);
    });
