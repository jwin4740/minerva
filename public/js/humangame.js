var runTime;
var bottomMinutes = $("#playerBottomTimerMinutes");
var bottomSeconds = $("#playerBottomTimerSeconds");
var topMinutes = $("#playerTopTimerMinutes");
var topSeconds = $("#playerTopTimerSeconds");
var board;
var blueMove;
var game = new Chess();
var whiteSanMove;
var blackSanMove;
var userColor;
var movePar;
var move;
var grayRow = 0;
var gameStart = false;
var gameDataArray = [];
var userCredentials = [];
var playerInfoArray = []; // once it is filled with both players; players get assigned playerOne of playerTwo
var socket = io.connect();
var messageForm = $('#messageForm');
var sendChat = $('#sendChat');
var chat = $('#chat');
var userFormArea = $('#userFormArea');
var messageArea = $('#messageArea');
var userForm = $('#userForm');
var users = $('#users');
var username = $('#username');
var localData;
var connections = 0;
var hisArray;

var regexColor;
var game;
var whitePlayerID;
var blackPlayerID;
var whitePlayerRating;
var blackPlayerRating;
var whitePlayerID;
var blackPlayerID;
var userColor;
var sessionStorage;
var gameTime;

var gameObject = {
    playerOne: "white",
    gameCreated: false,
    gameID: "",
    gameTime: "",
    gameStarted: 0,
    gameTurn: "white",
    whitePlayerData: {
        whitePlayerID: "x",
        whitePlayerRating: "x",
        whitePlayerTotalTime: "x",
        whitePlayerTimeMinutes: "x",
        whitePlayerTimeSeconds: "x"
    },
    blackPlayerData: {
        blackPlayerID: "x",
        blackPlayerRating: "x",
        blackPlayerTotalTime: "x",
        blackPlayerTimeMinutes: "x",
        blackPlayerTimeSeconds: "x"
    }
};
var localGameObject = {
    gameStarted: 0,
    blackTotalTime: "",
    whiteTotalTime: "",
    blackTimeMinutes: "",
    whiteTimeMinutes: "",
    blackTimeSeconds: "",
    whiteTimeSeconds: "",
    color: "",
    userID: "",
    rating: "",
    gameTime: ""

}

// on page load -----------------------
defaultLayout();

function defaultLayout() {
    var cfg = {
        draggable: false,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        orientation: 'white',
        onSnapEnd: onSnapEnd
    };

    board = ChessBoard('board', cfg);
}


var moment = moment().format("MMMM Do YYYY, h:mm:ss a");
var momentElement = $("#timeMoment");
momentElement.append(moment);
$(".panelMainChat").append(momentElement);


$(document).ready(function () {
    // sets sides and game object data
    $.get("/gameCreated", function () {
        console.log("good");
    }).done(function (data) {
        gameObject = data;
        if (gameObject.gameCreated != "true") {
            // $('#myModal').modal('show');
        } else {
            if (gameObject.whitePlayerData.whitePlayerID === "x") {
                gameObject.whitePlayerData.whitePlayerID = sessionStorage.userID;
                gameObject.whitePlayerData.whitePlayerRating = sessionStorage.rating;
                localGameObject.userID = sessionStorage.userID;
                localGameObject.rating = sessionStorage.rating;
                localGameObject.color = "white";
                gameObject.playerOne = "black";
                socket.emit("players confirmed", gameObject);

            } else {
                gameObject.blackPlayerData.blackPlayerID = sessionStorage.userID;
                gameObject.blackPlayerData.blackPlayerRating = sessionStorage.rating;

                localGameObject.userID = sessionStorage.userID;
                localGameObject.rating = sessionStorage.rating;
                localGameObject.color = "black";
                gameObject.playerOne = "white";

                socket.emit("players confirmed", gameObject);
            }
        }
    });
});

$("#setSides").on("click", function () {
    gameObject.gameCreated = true;
    $('#createGame').hide();
    $('#startGame').show();

    var sideColor = $("#sideColor").val();
    gameTime = "untimed";
    if (sideColor === "white") {
        localGameObject.gameTime = gameTime;
        gameObject.gameTime = gameTime;
        localGameObject.userID = sessionStorage.userID;
        localGameObject.rating = sessionStorage.rating;
        localGameObject.color = "white";
        gameObject.playerOne = "white";
        gameObject.whitePlayerData.whitePlayerID = sessionStorage.userID;
        gameObject.whitePlayerData.whitePlayerRating = sessionStorage.rating;


    } else {
        localGameObject.gameTime = gameTime;
        gameObject.gameTime = gameTime;
        localGameObject.userID = sessionStorage.userID;
        localGameObject.rating = sessionStorage.rating;
        localGameObject.color = "black";
        gameObject.playerOne = "black";
        gameObject.blackPlayerData.blackPlayerID = sessionStorage.userID;
        gameObject.blackPlayerData.blackPlayerRating = sessionStorage.rating;

    }

    $.post("/gameCreated", gameObject);

});

// sets sides and game object data
socket.on("players confirmed", function (data) {
    gameObject = data;
    console.log(gameObject);
});


$('#startGame').on("click", function () {
    localGameObject.gameStarted = 1;
    gameObject.gameStarted = 1;
    socket.emit('game start', gameObject);
    configBoard();
    if (gameObject.playerOne === localGameObject.color) {
        $("#playerTopName").html(gameObject.blackPlayerData.blackPlayerID);
        $("#playerBottomName").html(gameObject.whitePlayerData.whitePlayerID);
    } else {
        $("#playerTopName").html(gameObject.whitePlayerData.whitePlayerID);
        $("#playerBottomName").html(gameObject.blackPlayerData.blackPlayerID);
    }

});

socket.on('game start', function (data) {
    gameObject.gameStarted = true;
    localGameObject.gameStarted = true;
    $('#startGame').hide();
    $('#confirmGameStart').modal('show');
    console.log(data);
    configBoard();

    if (gameObject.playerOne === localGameObject.color) {
        $("#playerTopName").html(gameObject.blackPlayerData.blackPlayerID);
        $("#playerBottomName").html(gameObject.whitePlayerData.whitePlayerID);
    } else {
        $("#playerTopName").html(gameObject.whitePlayerData.whitePlayerID);
        $("#playerBottomName").html(gameObject.blackPlayerData.blackPlayerID);
    }
});

$("#confirmStartButton").on("click", function () {

    gameStart = true;
    if (localGameObject.color === 'white') {
        regexColor = /^b/;
    } else {
        regexColor = /^w/;
    }
    socket.emit("game has started", gameObject);
});

socket.on("game has started", function (data) {
    gameObject = data;
    localGameObject.gameStarted = true;
    gameStart = true;
});


// $("#playerOneLight").append("<img class='greenLight' src='/img/greenlight.png'>");
$("#playerTwoLight").append("<img class='greenLight' src='/img/greenlight.png'>");


// chat -----------------------------------------------------------
sendChat.on("keypress", function () {
    if (event.keyCode === 13) {

        // $(".panelMainChat").append("<h5>" + userID + ": </h5><div class='well'>" + sendChat.val() + "</div>")
        // socket.emit('send message', sendChat.val());
        // sendChat.val("");

        var messagi = $("#sendChat").val();
        var entry = $("<p class='userEntry'>");
        var spanElement = $("<span class='userColor'>");
        spanElement.text(localGameObject.userID + ": ");
        entry.append(spanElement);
        entry.append(messagi);
        $(".panelMainChat").append(entry);
        socket.emit('send message', messagi);
        $("#sendChat").val("");
    }
});
socket.on('new message', function (data) {

    // if (userID === localData.whitePlayerID) {
    //     $(".panelMainChat").append("<h5>" + sessionStorage.blackPlayerID + ": </h5><div class='well'>" + data + "</div>");
    // } else {
    //     $(".panelMainChat").append("<h5>" + sessionStorage.whitePlayerID + ": </h5><div class='well'>" + data + "</div>");
    // }

    if (localGameObject.userID === gameObject.whitePlayerData.whitePlayerID) {
        var tempID = gameObject.blackPlayerData.blackPlayerID;

        var entry = $("<p class='userEntry'>");
        var spanElement = $("<span class='otherColor'>");

    } else {
        var tempID = gameObject.whitePlayerData.whitePlayerID;
        var entry = $("<p class='userEntry'>");
        var spanElement = $("<span class='otherColor'>");
    }


    spanElement.text(tempID + ": ");
    entry.append(spanElement);
    entry.append(data);
    $(".panelMainChat").append(entry);

});





// chat -----------------------------------------------------------

function configBoard() {
    if (localGameObject.color === "white") {
        var cfg = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            orientation: 'white',
            onSnapEnd: onSnapEnd
        };
    } else {
        var cfg = {
            draggable: true,
            position: 'start',
            onDragStart: onDragStart,
            onDrop: onDrop,
            orientation: 'black',
            onSnapEnd: onSnapEnd
        };
    }
    startGame();
    board = ChessBoard('board', cfg);
}

function startGame() {
    gameStart = true;
    if (localGameObject.color === 'white') {
        regexColor = /^b/;
    } else {
        regexColor = /^w/;
    }
}

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true || gameStart === false || piece.search(regexColor) !== -1) {
        return false;
    }
};
var counter = 0;



var uMove;
var moveCounter = 1;

var onDrop = function (source, target) {
    // see if the move is legal
    move = game.move({
        from: source,
        to: target,
        promotion: 'n'
    });

    // illegal move
    if (move === null) return 'snapback';

    socket.emit('move', move);


    uMove = move.from + move.to;
    console.log("San move: " + uMove);



};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
    board.position(game.fen());
    whiteMovedHistory();
    color = localGameObject.color;
    if (localGameObject.color === 'white') {
        whiteMovedHistory();
    } else {
        blackMovedHistory();
    }
    checkCapture(move, color);

};

socket.on('moveresponse', function (msg) {
    game.move(msg);
    board.position(game.fen());
});



function checkCapture(move, color) {
    if (move.flags.includes("c") || move.flags.includes("e")) {
        var shortColor;
        var lowerPiece = move.captured;
        var piece = lowerPiece.toUpperCase();
        var imageOutput;
        var pieceType;

        if (piece === 'P') {
            pieceType = "Pawn";
        } else {
            pieceType = "Other";
        }
        constructImageOutput()

        function constructImageOutput() {
            if (color === "white") {
                shortColor = 'b';
            } else {
                shortColor = 'w';
            }


            switch (piece) {
                case 'P':
                    imageOutput = shortColor + 'P';
                    break;
                case 'N':
                    imageOutput = shortColor + 'N';
                    break;
                case 'B':
                    imageOutput = shortColor + 'B';
                    break;
                case 'R':
                    imageOutput = shortColor + 'R';
                    break;
                case 'Q':
                    imageOutput = shortColor + 'Q';
                    break;
            }
            console.log(imageOutput);

        }

        $('#' + color + pieceType).append("<img class='capturedPiece' alt='capturedPiece' src='./img/chesspieces/wikipedia/" + imageOutput + ".png'>");
        var captureObject = {
            color: color,
            pieceType: pieceType,
            imageOutput: imageOutput
        }

        socket.emit('sendCapture', captureObject);
    }
}

socket.on('receiveCapture', function (data) {
   

     $('#' + data.color + data.pieceType).append("<img class='capturedPiece' alt='capturedPiece' src='./img/chesspieces/wikipedia/" + data.imageOutput + ".png'>");

});


function whiteMovedHistory() {
    hisArray = game.history();
    var n = hisArray.length;
    var history = '';
    var counterMod = 0;
    for (var i = 0; i < n; i++) {
        counterMod++;

        history += hisArray[i] + " ";
        if (counterMod % 2 === 0) {
            history += " .... ";
        }

    }
    $('#gameHistory').html(history);

}

function blackMovedHistory() {
    hisArray = game.history();
    var n = hisArray.length;
    var history = '';
    var counterMod = 0;
    for (var i = 0; i < n; i++) {
        counterMod++;
        if (counterMod % 2 != 0) {
            history += " .... ";
        }
        history += hisArray[i] + " ";

    }
    $('#gameHistory').html(history);
}