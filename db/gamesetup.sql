USE minerva;


CREATE TABLE gamesetup (
id INTEGER(10) NOT NULL auto_increment primary key,
gameStart boolean DEFAULT false,
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
);
