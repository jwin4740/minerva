var sanTo120 = {
    a8: 91,
    b8: 92,
    c8: 93,
    d8: 94,
    e8: 95,
    f8: 96,
    g8: 97,
    h8: 98,
    a7: 81,
    b7: 82,
    c7: 83,
    d7: 84,
    e7: 85,
    f7: 86,
    g7: 87,
    h7: 88,
    a6: 71,
    b6: 72,
    c6: 73,
    d6: 74,
    e6: 75,
    f6: 76,
    g6: 77,
    h6: 78,
    a5: 61,
    b5: 62,
    c5: 63,
    d5: 64,
    e5: 65,
    f5: 66,
    g5: 67,
    h5: 68,
    a4: 51,
    b4: 52,
    c4: 53,
    d4: 54,
    e4: 55,
    f4: 56,
    g4: 57,
    h4: 58,
    a3: 41,
    b3: 42,
    c3: 43,
    d3: 44,
    e3: 45,
    f3: 46,
    g3: 47,
    h3: 48,
    a2: 31,
    b2: 32,
    c2: 33,
    d2: 34,
    e2: 35,
    f2: 36,
    g2: 37,
    h2: 38,
    a1: 21,
    b1: 22,
    c1: 23,
    d1: 24,
    e1: 25,
    f1: 26,
    g1: 27,
    h1: 28
};





var bottomMinutes = $("#playerBottomTimerMinutes");
var bottomSeconds = $("#playerBottomTimerSeconds");
var topMinutes = $("#playerTopTimerMinutes");
var topSeconds = $("#playerTopTimerSeconds");
var board;
var blueMove;
var game = new Chess();
var gameStart = false;
var whiteSanMove;
var blackSanMove;
var userColor;
var movePar;
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
var whiteBoolClient = false;
var whiteBoolServer = true;
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
        whitePlayerTimeMinutes: "x",
        whitePlayerTimeSeconds: "x"
    },
    blackPlayerData: {
        blackPlayerID: "x",
        blackPlayerRating: "x",
        blackPlayerTimeMinutes: "x",
        blackPlayerTimeSeconds: "x"
    }
};
var localGameObject = {
    gameStarted: 0,
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
            $('#myModal').modal('show');
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
    var sideColor = $("#sideColor").val();
    gameTime = parseInt($("#timeSelection").val());
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

$('#whiteGuy').on("click", function () {

    sessionStorage.whitePlayerID = sessionStorage.userID;
    userID = sessionStorage.userID;
    whitePlayerID = sessionStorage.userID;
    whitePlayerRating = sessionStorage.rating;
    userColor = "white";



    socket.emit('white player click', sessionStorage);
});

$('#blackGuy').on("click", function () {
    sessionStorage.blackPlayerID = sessionStorage.userID;
    userID = sessionStorage.userID;
    blackPlayerID = sessionStorage.userID;
    blackPlayerRating = sessionStorage.rating;
    userColor = "black";



    socket.emit('black player click', sessionStorage);

});

socket.on('white player click', function (data) {
    console.log("I got white's data");

    sessionStorage.whitePlayerID = data.whitePlayerID;
    sessionStorage.whitePlayerRating = data.rating;

    localData = sessionStorage;
    console.log(sessionStorage);
});

socket.on('black player click', function (data) {
    console.log("I got black's data");
    sessionStorage.blackPlayerID = data.blackPlayerID;
    sessionStorage.blackPlayerRating = data.rating;

    localData = sessionStorage;
    console.log(sessionStorage);
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
    timeControl();
});

socket.on('game start', function (data) {
    gameObject.gameStarted = true;
    localGameObject.gameStarted = true;
    $('#startGame').hide();
    $('#confirmGameStart').modal('show');
    console.log(data);
    configBoard();
    timeControl();
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
    //     $(".panelMainChat").append("<h5>" + sessionStorage.blackPlayerID + ": </h5><div class='well'>" + data.msg + "</div>");
    // } else {
    //     $(".panelMainChat").append("<h5>" + sessionStorage.whitePlayerID + ": </h5><div class='well'>" + data.msg + "</div>");
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
    entry.append(data.msg);
    $(".panelMainChat").append(entry);

});





// chat -----------------------------------------------------------

function timeControl() {
    var tempTime = parseInt(gameObject.gameTime);
    setInitialTime(tempTime);

    function setInitialTime(tempTime) {
        gameObject.whitePlayerData.whitePlayerTimeMinutes = tempTime;
        gameObject.whitePlayerData.whitePlayerTimeMinutes = 0;
        gameObject.blackPlayerData.blackPlayerTimeMinutes = tempTime;
        gameObject.blackPlayerData.blackPlayerTimeSeconds = 0;
        localGameObject.whiteTimeMinutes = tempTime;
        localGameObject.whiteTimeSeconds = 0;
        localGameObject.blackTimeMinutes = tempTime;
        localGameObject.blackTimeSeconds = 0;

        if (gameObject.playerOne === "white") {
            bottomMinutes.html(localGameObject.whiteTimeMinutes);
            bottomMinutes.html(localGameObject.whiteTimeMinutes);
            topMinutes.html(localGameObject.blackTimeMinutes);
            topMinutes.html(localGameObject.blackTimeMinutes);
        } else {
            bottomMinutes.html(localGameObject.blackTimeMinutes);
            bottomMinutes.html(localGameObject.blackTimeMinutes);
            topMinutes.html(localGameObject.whiteTimeMinutes);
            topMinutes.html(localGameObject.whiteTimeMinutes);
        }

    }
}

socket.on('move', function (msg) {

    game.move(msg);
    board.position(game.fen());
});





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
}

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true || gameStart === false) {
        return false;
    }
};
var counter = 0;



var uMove;
var moveCounter = 1;

var onDrop = function (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'n'
    });

    // illegal move
    if (move === null) return 'snapback';
    socket.emit('move', move);
    socket.emit('timer change', gameObject);
    uMove = move.from + move.to;
    console.log("San move: " + uMove);



};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
    board.position(game.fen());

};

socket.on('timer change', function (data) {
    gameObject = data;
})