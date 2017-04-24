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
var clientSession;
var connections = 0;
var whiteBoolClient = false;
var whiteBoolServer = true;


// $("#sendChat").on("keypress", function (event) {
//     if (event.keyCode === 13) {
//         // var upperUser = userName.toUpperCase();
//         // var message = $("#sendChat").val();
//         // var entry = $("<p class='userEntry'>");
//         // var spanElement = $("<span class='userColor'>");
//         // spanElement.text(upperUser + ": ");
//         // entry.append(spanElement);
//         // entry.append(message);
//         // $(".panelMainChat").append(entry);
//         $("#sendChat").val("");
//     }
// });

// ---------------------------------------------
$('#setSides').on("click", function () {
    var side = $('#sideColor').val();
    var playerTwoColor;
    console.log(side);
    gameDataArray[0].playerOne.color = side;
    gameDataArray[0].playerOne.ready = true;
    if (side === "white") {
        playerTwoColor = "black"
    } else {
        playerTwoColor = "white"
    }
    gameDataArray[0].playerTwo.color = playerTwoColor;
    console.log(gameDataArray);

    checkIfReady();

});
$("#logIn").on("click", function () {
    var userVal = $("#username").val();
    var username = {
        username: userVal
    };
    console.log("clicked");
    $.post("/login", username)
        .done(function () {


            getSessionId();
        });


});


function getSessionId() {

    $.get("/loggedIn", function (data) {

        clientSession = data;
        console.log(clientSession);
    });

}

$('#startGame').on("click", function () {
    socket.emit('start game click', {
        whiteBoolClient: false
    });
    whiteBoolClient = true;

});

socket.on('game started', function (data) {
    if (whiteBoolClient === false) {
        whiteBoolClient = data.whiteBoolServer;
    }
    console.log(data);
    configBoard();
});
sendChat.on("keypress", function () {
    if (event.keyCode === 13) {
        console.log('submitted');
        socket.emit('send message', sendChat.val());
        sendChat.val("");
    }
});
socket.on('new message', function (data) {
    $(".panelMainChat").append("<div class='well'>" + data.msg + "</div>");
});

userForm.submit(function (e) {
    e.preventDefault();
    console.log('submitted');
    socket.emit('new user', username.val(), function (data) {
        if (data) {
            userFormArea.hide();
            messageArea.show();
        }
    });
    username.val("");
});

socket.on('get users', function (data) {
    var content = '';
    var n = data.length;
    for (var i = 0; i < n; i++) {
        content += '<li class="list-group-item">' + data[i] + '</li>';
    }
    users.html(content);
});

socket.on('serverMove', function (plyMove) {

   
    console.log("movesocket");
  
     game.move(plyMove.move);

});

// $('#resetBtn').on("click", function () {
//     console.log("clicked");
//     $("#gameStatus").html("");
//     game.reset();
// })

// // $('#startGame').on("click", function () {
// //     gameStart = true;
// // })

// // get initial data and push to array
// $.get("/game", function (data) {
//     console.log(data);
//     gameDataArray.push(data);
//     console.log(gameDataArray);
//     setTimeout(fireCall, 2000) // TODO fire on Promise
// });

// function fireCall() {
//     $.get("/loggedIn", function (data) {
//         console.log(data);
//         if (data.loggedIn) {
//             var tempEmail = data.uniqueID[0];
//             var tempID = data.uniqueID[1];
//             var tempRating = data.uniqueID[2];

//             sessionStorage.email = tempEmail;
//             sessionStorage.userID = tempID;
//             sessionStorage.rating = tempRating;

//             userCredentials.push(sessionStorage);
//             console.log(userCredentials);
//             updateGameData(tempEmail, tempID, tempRating);
//         }
//     });
// }



// function updateGameData(email, userID, rating) {
//     if (gameDataArray[0].playersJoined === 0) {
//         gameDataArray[0].playerOne.email = email;
//         gameDataArray[0].playerOne.username = userID;
//         gameDataArray[0].playerOne.rating = rating;
//         gameDataArray[0].playersJoined = 1;
//         console.log(gameDataArray);
//         $.post("/game", {
//             gameDataArray
//         }).done(checkPost);


//     } else {
//         gameDataArray[0].playerTwo.email = email;
//         gameDataArray[0].playerTwo.username = userID;
//         gameDataArray[0].playerTwo.rating = rating;
//         gameDataArray[0].playersJoined = 2;
//         console.log(gameDataArray);
//         $.post("/game", {
//             gameDataArray
//         }).done(checkPost);
//     }


// }

// function checkPost() {
//     $.get("/game", function (data) {
//         console.log("hello postman");
//         console.log(data);
//     })
// }

// function checkIfReady() {
//     if (gameDataArray[0].playerOne.ready === true && gameDataArray[0].playerTwo.ready === true) {
//         $("body").append("We are ready");
//     } else {
//         $("body").append("Waiting for the other player");
//     }
// }



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
    socket.emit('move', {
        move: move,
        board: game.fen()
    });
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

function configBoard() {
    if (whiteBoolClient === true && whiteBoolServer === true) {
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