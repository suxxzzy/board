//회원가입 시 받는 정보: 아이디, 비밀번호, 비밀번호 재입력.
//서버 측에서 해당 정보를 모두 검증해 줄 필요가 있다.
//클라이언트에서 막는다 해도, 우회할 방법은 있음
const { user } = require('../../models/index');
const { isValidID, isValidPassWord } = require('../../modules/validator');
const { getCRTIME } = require('../../modules/datetimeconverter');

module.exports = async (req, res) => {
    try {
        const { id, password, retype } = req.body;
        //세 정보 중 하나라도 빠졌다면, 가입 불가함
        if (!id || !password || !retype) {
            return res.status(400).json({ message: '회원가입에 실패했습니다' });
        }
        //가입불가한 경우
        //아이디가 유효성 검사를 통과하지 않은 경우
        if (!isValidID(id)) {
            return res
                .status(400)
                .json({ message: 'id가 유효한 형식이 아닙니다' });
        }

        //비밀번호가 유효성 검사를 통과하지 않은 경우(재입력은 굳이)
        if (!isValidPassWord(password)) {
            return res
                .status(400)
                .json({ message: '비밀번호가 유효한 형식이 아닙니다' });
        }

        //같은 아이디가 이미 존재하는 경우
        const userWithSameID = await user.findOne({ where: { USERID: id } });
        if (userWithSameID) {
            return res
                .status(403)
                .json({ message: '이미 사용중인 아이디입니다' });
        }

        //비밀번호 !== 재입력인 경우
        if (password !== retype) {
            return res.status(400).json({
                message: '비밀번호와 재입력한 비밀번호가 일치하지 않습니다',
            });
        }

        //위 조건을 모두 다 통과한 경우에만, 회원가입을 진행하고, 사용자 정보를 반환
        const newUser = await user.create({
            USERID: id,
            USERPW: password,
            CRTIME: getCRTIME(),
        });

        return res.status(201).json({
            data: {
                id: newUser.UID,
                userid: newUser.USERID,
                crtime: newUser.CRTIME,
            },
            message: '회원가입에 성공하였습니다',
        });
    } catch (e) {
        //서버 에러 처리
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 회원 가입 처리에 실패했습니다' });
    }
};
