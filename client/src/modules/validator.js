export const isValidID = (id) => {
    const regexp = /^[A-Za-z0-9]{4,20}$/;
    return regexp.test(id);
};

export const isValidPassword = (password, msg) => {
    const regexp =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*\-_+=])[A-Za-z\d!@#$%^&*\-_+=]{8,20}$/;
    if (msg === undefined) {
        return regexp.test(password);
    } else {
        return regexp.test(password)
            ? '사용가능한 비밀번호입니다'
            : '영문, 숫자, 특수문자 최소 1자씩 8~20자로 만들어주세요';
    }
};

export const isSamePassword = (password, retype, msg) => {
    //msg인자가 없으면 불린 값만 리턴
    if (msg === undefined) {
        if (password === '' || retype === '') return false;
        return password === retype;
    } else {
        //msg인자가 있으면 메세지 리턴
        if (password === '') return '비밀번호를 입력하세요';
        if (retype === '') return '비밀번호를 다시 입력하세요';
        if (password !== retype) return '비밀번호가 일치하지 않습니다';
        return '비밀번호가 일치합니다';
    }
};
