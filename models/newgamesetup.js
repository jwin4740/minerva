module.exports = function (sequelize, DataTypes) {
    var Gamesetup = sequelize.define("gamesetup", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        gameStart: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        playersJoined: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        starter: {
            type: DataTypes.STRING

        },
        playerOneColor: {
            type: DataTypes.STRING
        },
        playerOneUserName: {
            type: DataTypes.STRING
        },
        playerOneEmail: {
            type: DataTypes.STRING
        },
        playerOneReady: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        playerOneRating: {
            type: DataTypes.INTEGER,
            defaultValue: 1000
        },
        playerTwoColor: {
            type: DataTypes.STRING
        },
        playerTwoUserName: {
            type: DataTypes.STRING
        },
        playerTwoEmail: {
            type: DataTypes.STRING
        },
        playerTwoReady: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        playerTwoRating: {
            type: DataTypes.INTEGER,
            defaultValue: 1000
        }
    }, {
        timestamps: false,
        freezeTableName: true,
        tableName: 'gamesetup'
    });
    return Gamesetup;
};