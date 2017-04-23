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

var board;
var blueMove;
var game = new Chess();
var whiteSanMove;
var blackSanMove;
var userColor = "white";
var movePar;
var grayRow = 0;
var gameStart = false;
var gameDataArray = [];
var userCredentials = [];
var playerInfoArray = []; // once it is filled with both players; players get assigned playerOne of playerTwo

$('#resetBtn').on("click", function () {
    console.log("clicked");
    $("#gameStatus").html("");
    game.reset();
})

// $('#startGame').on("click", function () {
//     gameStart = true;
// })

// get initial data and push to array
$.get("/game", function (data) {
    console.log(data);
    gameDataArray.push(data[0]);
    console.log(gameDataArray);
    setTimeout(fireCall, 2000) // TODO fire on Promise
});

function fireCall() {
    $.get("/loggedIn", function (data) {
        console.log(data);
        if (data.loggedIn) {
            var tempEmail = data.uniqueID[0];
            var tempID = data.uniqueID[1];
            var tempRating = data.uniqueID[2];

            // sessionStorage.email = tempEmail;
            // sessionStorage.userID = tempID;
            // sessionStorage.rating = tempRating;

            // userCredentials.push(sessionStorage);
            // console.log(userCredentials);
            updateGameData(tempEmail, tempID, tempRating);
        }
    });
}



function updateGameData(email, userID, rating) {
    if (2 == 2) {
        gameDataArray[0].playerOneEmail = email;
        gameDataArray[0].playerOneUserName = userID;
        gameDataArray[0].playerOneRating = rating;
        gameDataArray[0].playersJoined = 1;
        console.log(gameDataArray);
        $.ajax({
                method: "PUT",
                url: "/game",
                data: [gameDataArray]
            })
            .done(function () {
                console.log("work");
            });

    } else {
        gameDataArray[0].playerTwoEmail = email;
        gameDataArray[0].playerTwoUserName = userID;
        gameDataArray[0].playerTwoRating = rating;
        gameDataArray[0].playersJoined = 2;
        console.log(gameDataArray);
        $.ajax({
                method: "PUT",
                url: "/game",
                data: grayRow


            })
            .done(function () {
                console.log("work")
            });

    }


}

function checkPost() {
    $.get("/game", function (data) {
        console.log("hello postman");
        console.log(data);
    })
}

function checkIfReady() {
    if (gameDataArray[0].playerOne.ready === true && gameDataArray[0].playerTwo.ready === true) {
        $("body").append("We are ready");
    } else {
        $("body").append("Waiting for the other player");
    }
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
    console.log(move);
    // illegal move
    if (move === null) return 'snapback';
    uMove = move.from + move.to;
    console.log("San move: " + uMove);


    // whiteSanMove = move.san;
    // movePar = $("<div class='movePar'>");
    // var whiteMoveSpan = $("<p class='whiteMove'>");
    // whiteMoveSpan.text(moveCounter + ") " + whiteSanMove);

    // movePar.append(whiteMoveSpan);
    // $(".panelMainNotate").append(movePar);




    // make random legal move for black
    // window.setTimeout(makeRandomMove, 250);
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
    board.position(game.fen());

};
if (userColor === "white") {
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


board = ChessBoard('board', cfg);
$('#clearBtn').on('click', board.clear);
$('#startBtn').on('click', board.start);