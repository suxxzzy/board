const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('board', {
    BID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "게시글 PK"
    },
    UID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "작성한 UID",
      references: {
        model: 'user',
        key: 'UID'
      }
    },
    TITLE: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "",
      comment: "게시글 제목"
    },
    CONTENT: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      defaultValue: "",
      comment: "게시글 내용"
    },
    CRTIME: {
      type: DataTypes.STRING(14),
      allowNull: false,
      defaultValue: "",
      comment: "게시글 생성시간(yyyymmddhhmmss)"
    },
    VIEWCOUNT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "게시글 조회수"
    },
    DISCD: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "게시글 삭제여부"
    }
  }, {
    sequelize,
    tableName: 'board',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "BID" },
        ]
      },
      {
        name: "FK_BOARD_ACCOUNT",
        using: "BTREE",
        fields: [
          { name: "UID" },
        ]
      },
    ]
  });
};
