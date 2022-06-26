module.exports = {
    getCRTIME: () => {
        //현재 날짜 정보 구하기
        const addzero = function (number, length) {
            let str = '' + number;
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        };

        Date.prototype.YYYYMMDDHHMMSS = function () {
            const yyyy = this.getFullYear().toString();
            const MM = addzero(this.getMonth() + 1, 2);
            const dd = addzero(this.getDate(), 2);
            const hh = addzero(this.getHours(), 2);
            const mm = addzero(this.getMinutes(), 2);
            const ss = addzero(this.getSeconds(), 2);

            return yyyy + MM + dd + hh + mm + ss;
        };

        const timestamp = new Date().YYYYMMDDHHMMSS();
        return timestamp;
    },
};
