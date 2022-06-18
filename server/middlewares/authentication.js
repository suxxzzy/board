//토큰 인증
const { verify } = require('jsonwebtoken');
const { user } = require('../models/index');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        //토큰이 존재하지 않는 경우
        const { accessToken } = req.cookies;
        if (!accessToken) {
            return res.status(401).json({ message: '권한이 없습니다' });
        }

        //토큰이 존재하는 경우 검증 과정을 거친다
        //잘못된 토큰이거나 조작된 토큰인 경우
        const decoded = verify(accessToken, process.env.ACCESS_SECRET);
        if (!decoded) {
            return res
                .status(401)
                .json({ message: '토큰이 유효하지 않습니다' });
        }
        //올바른 토큰인 경우: 사용자 아이디를 담아서 다음 미들웨어로 이전
        const verifiedUser = await user.findByPk(decoded.id);
        req.id = verifiedUser.UID;
        return next();
    } catch (e) {
        return res
            .status(500)
            .json({ message: '서버가 토큰 검증에 실패했습니다' });
    }
};
