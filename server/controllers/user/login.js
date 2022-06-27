const { user } = require('../../models/index');
const {
    generateAccessToken,
    sendAccessToken,
} = require('../../middlewares/tokenFunctions');

//아이디와 비밀번호가 둘 다입력, 일치할 경우, 토큰을 발급하고
//쿠키에 담아서 응답. 그리고 사용자 아이디도 같이 담아준다.

module.exports = async (req, res) => {
    try {
        //사용자로부터 아이디와 비밀번호를 받는다
        const { id, password } = req.body;
        if (!id || !password) {
            return res.status(400).json({ message: '로그인에 실패했습니다' });
        }

        //존재하지 않는 아이디인 경우
        const existUser = await user.findOne({ where: { USERID: id } });
        if (!existUser) {
            return res
                .status(400)
                .json({ message: '존재하지 않는 아이디입니다' });
        }

        //아이디는 맞지만, 비밀번호가 일치하지 않는 경우
        if (existUser.USERPW !== password) {
            return res
                .status(400)
                .json({ message: '비밀번호가 일치하지 않습니다' });
        }

        //아이디와 비밀번호 모두 일치하는 경우
        //쿠키에 토큰을 담고, 사용자 아이디는 응답 바디에 담아준다
        const accessToken = generateAccessToken(existUser.UID);

        sendAccessToken(res, accessToken);
        return res.status(200).json({
            data: { uid: existUser.UID },
            message: '로그인에 성공했습니다',
        });
    } catch (e) {
        //서버 에러 처리
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 로그인 처리에 실패했습니다' });
    }
};
