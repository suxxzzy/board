//id 유효성 검사: 영문 숫자 합해서 20자. 숫자는 굳이 포함안해도됨
exports.isValidID = (id) => {
    const regexp = /^[A-Za-z0-9]{4,20}$/;
    return regexp.test(id);
};

//비밀번호 유효성 검사: 영문 숫자 특수문자 모두 포함해 20자.
exports.isValidPassWord = (password) => {
    const regexp =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    return regexp.test(password);
};

//현재 날짜 정보 구하기
const pad = function (number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
};

Date.prototype.YYYYMMDDHHMMSS = function () {
    const yyyy = this.getFullYear().toString();
    const MM = pad(this.getMonth() + 1, 2);
    const dd = pad(this.getDate(), 2);
    const hh = pad(this.getHours(), 2);
    const mm = pad(this.getMinutes(), 2);
    const ss = pad(this.getSeconds(), 2);

    return yyyy + MM + dd + hh + mm + ss;
};

const timestamp = new Date().YYYYMMDDHHMMSS();

exports.getTimeStamp = () => timestamp;
