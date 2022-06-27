//회원가입 시 받는 정보: 아이디, 비밀번호, 비밀번호 재입력.
//서버 측에서 해당 정보를 모두 검증해 줄 필요가 있다.
//클라이언트에서 막는다 해도, 우회할 방법은 있음
const { user } = require('../../models/index');
const {
    isValidID,
    isValidPassWord,
    isSamePassword,
} = require('../../modules/validator');
const { getCRTIME } = require('../../modules/datetimeconverter');
const { request } = require('express');

module.exports = async (req, res) => {
    try {
        const { id, password, retype } = req.body;

        if (!id || !password || !retype) {
            return res.status(400).json({ message: '회원가입에 실패했습니다' });
        }

        //아이디가 유효성 검사를 통과하지 않은 경우
        if (!isValidID(id)) {
            return res
                .status(400)
                .json({ message: 'id가 유효한 형식이 아닙니다' });
        }

        //비밀번호가 유효성 검사를 통과하지 않은 경우
        if (!isValidPassWord(password)) {
            return res
                .status(400)
                .json({ message: '비밀번호가 유효한 형식이 아닙니다' });
        }

        //비밀번호와 재입력이 일치하지 않는 경우
        if (!isSamePassword) {
            return res
                .status(400)
                .json({ message: '비밀번호가 일치하지 않습니다' });
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
