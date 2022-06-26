const { sign } = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    generateAccessToken: (userid) => {
        const accessToken = sign({ id: userid }, process.env.ACCESS_SECRET, {
            expiresIn: '24h',
        });

        return accessToken;
    },
    sendAccessToken: (res, accessToken) => {
        const cookieOptions = {
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24, //24h
        };

        return res.cookie('accessToken', accessToken, cookieOptions);
    },
};
