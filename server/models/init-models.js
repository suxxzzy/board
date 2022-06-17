var DataTypes = require("sequelize").DataTypes;
var _attachmentfile = require("./attachmentfile");
var _board = require("./board");
var _user = require("./user");

function initModels(sequelize) {
  var attachmentfile = _attachmentfile(sequelize, DataTypes);
  var board = _board(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  attachmentfile.belongsTo(board, { as: "BID_board", foreignKey: "BID"});
  board.hasMany(attachmentfile, { as: "attachmentfiles", foreignKey: "BID"});
  board.belongsTo(user, { as: "UID_user", foreignKey: "UID"});
  user.hasMany(board, { as: "boards", foreignKey: "UID"});

  return {
    attachmentfile,
    board,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
