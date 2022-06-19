const { user } = require('../../models/index');
const { isValidID } = require('../../modules/validator');

module.exports = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: '아이디가 없습니다' });
        }
        //아이디가 유효성 검사를 통과하지 않은 경우
        if (!isValidID(id)) {
            return res
                .status(400)
                .json({ message: 'id가 유효한 형식이 아닙니다' });
        }
        //같은 아이디가 이미 존재하는 경우
        const userWithSameID = await user.findOne({ where: { USERID: id } });
        if (userWithSameID) {
            return res
                .status(403)
                .json({ message: '이미 사용중인 아이디입니다' });
        }

        return res.status(200).json({
            message: '사용가능한 아이디입니다',
        });
    } catch (e) {
        //서버 에러 처리
        console.error(e);
        return res
            .status(500)
            .json({ message: '서버가 아이디 중복검사에 실패했습니다' });
    }
};
