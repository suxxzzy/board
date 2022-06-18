// import axios from 'axios';

module.exports = {
    isValidID: (id) => {
        //+ 서버 측에서 중복확인 검사까지.
        const regexp = /^[A-Za-z0-9]{4,20}$/;
        return regexp.test(id);
    },
    isValidPassWord: (password) => {
        const regexp =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*\-_+=])[A-Za-z\d!@#$%^&*\-_+=]{8,20}$/;
        return regexp.test(password);
    },
    isSamePassword: (password, retype) => {
        return password === retype;
    },
};
