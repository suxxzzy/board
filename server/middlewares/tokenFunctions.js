const { sign } = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    generateAccessToken: (userid) => {
        const accessToken = sign({ id: userid }, process.env.ACCESS_SECRET, {
            expiresIn: '2h',
        });

        return accessToken;
    },
    sendAccessToken: (res, accessToken) => {
        const cookieOptions = {
            path: '/',
            maxAge: 1000 * 60 * 60 * 2,
        };

        return res.cookie('accessToken', accessToken, cookieOptions);
    },
};
