const dotenv = require('dotenv');
dotenv.config();

module.exports = async (req, res) => {
    try {
        console.log('요청받은 사용자 아이디는?', req.id);
        return res
            .status(200)
            .cookie('accessToken', null, {
                path: '/',
                maxAge: 0,
            })
            .json({ message: '로그아웃에 성공했습니다' });
    } catch (e) {
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 로그아웃 요청 처리에 실패했습니다' });
    }
};
