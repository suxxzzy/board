const DataTypes = require('sequelize').DataTypes;
const _attachmentfile = require('./attachmentfile');
const _board = require('./board');
const _user = require('./user');

function initModels(sequelize) {
    const attachmentfile = _attachmentfile(sequelize, DataTypes);
    const board = _board(sequelize, DataTypes);
    const user = _user(sequelize, DataTypes);

    attachmentfile.belongsTo(board, { as: 'BID_board', foreignKey: 'BID' });
    board.hasMany(attachmentfile, { as: 'attachmentfiles', foreignKey: 'BID' });
    board.belongsTo(user, { as: 'UID_user', foreignKey: 'UID' });
    user.hasMany(board, { as: 'boards', foreignKey: 'UID' });

    return {
        attachmentfile,
        board,
        user,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
