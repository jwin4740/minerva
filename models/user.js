module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING
    },
    salt: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'users'
  });
  return User;
};