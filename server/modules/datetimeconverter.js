module.exports = {
    getCRTIME: () => {
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
        return timestamp;
    },
};
