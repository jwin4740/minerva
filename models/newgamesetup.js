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
        }
        boolean DEFAULT false,
        playersJoined INTEGER(3) DEFAULT 0,
        playerOneColor VARCHAR(255) Default NULL,
        playerOneUserName VARCHAR(255) Default NULL,
        playerOneEmail VARCHAR(255) Default NULL,
        playerOneRating INTEGER(10) Default NULL,
        playerOneReady boolean DEFAULT false,
        playerTwoUserName VARCHAR(255) Default NULL,
        playerTwoEmail VARCHAR(255) Default NULL,
        playerTwoRating INTEGER(10) Default NULL,
        playerTwoReady boolean DEFAULT false,
        playerTwoColor VARCHAR(255) Default NULL,
        starter VARCHAR(255) DEFAULT NULL
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