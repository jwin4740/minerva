module.exports = function (sequelize, DataTypes) {
  var movedata = sequelize.define("humangame", {
    move: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    white: {
      type: DataTypes.STRING
    },
    black: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'humangame'
  });
  return movedata;
};