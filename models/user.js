module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
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
      type: DataTypes.STRING,
    },
    hash: {
      type: DataTypes.STRING
    },
    salt: {
      type: DataTypes.STRING
    },
    account_created: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: 'User'
  });
  return User;
};