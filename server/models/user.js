const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    UID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "유저 PK"
    },
    USERID: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true,
      comment: "유저 아이디"
    },
    USERPW: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "유저 패스워드"
    },
    CRTIME: {
      type: DataTypes.STRING(14),
      allowNull: false,
      comment: "유저 생성시간(yyyymmddhhmmss)"
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "UID" },
          { name: "USERID" },
        ]
      },
    ]
  });
};
