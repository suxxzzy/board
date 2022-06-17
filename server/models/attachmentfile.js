const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('attachmentfile', {
    ATTACHID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "첨부파일 PK"
    },
    BID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "게시글 FK",
      references: {
        model: 'board',
        key: 'BID'
      }
    },
    FILENAME: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "",
      comment: "첨부파일 파일명"
    },
    FILEPATH: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "첨부파일 경로"
    },
    EXT: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: "첨부파일 확장자명"
    },
    SIZE: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "첨부파일 크기"
    },
    CRTIME: {
      type: DataTypes.STRING(14),
      allowNull: false,
      defaultValue: "",
      comment: "첨부파일 생성시간(yyyymmddhhmmss)"
    }
  }, {
    sequelize,
    tableName: 'attachmentfile',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ATTACHID" },
        ]
      },
      {
        name: "FK_ATTACHMENTFILE_BOARD",
        using: "BTREE",
        fields: [
          { name: "BID" },
        ]
      },
    ]
  });
};
