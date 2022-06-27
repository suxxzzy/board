module.exports = {
    isValidID: (id) => {
        const regexp = /^[A-Za-z0-9]{4,20}$/;
        return regexp.test(id);
    },
    isValidPassWord: (password) => {
        const regexp =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
        return regexp.test(password);
    },
    isSamePassword: (password, retype) => {
        return password === retype;
    },
};
