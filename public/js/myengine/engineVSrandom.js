// $('#resetBtn').on("click", function () {
//     console.log("clicked");
//     $("#gameStatus").html("");
//     game.reset();
// })

// do not pick up pieces if the game is over
// only pick up pieces for White
var motion = true;
var myFen = '8/7K/8/8/8/8/7k/8 w - 1 1';
// var game = new Chess('8/7K/8/8/8/8/7k/8 w - 1 1');
var cfg = {
    position: 'start',
    orientation: 'white'
};
board = ChessBoard('board', cfg);


$("#start").on('click', function () {
    randomMove();
});


$("#pause").on('click', function () {
   motion = false;
});

function randomMove() {
    var randomIndex = Math.floor(Math.random() * legalMoves.length);
    var randMove = legalMoves[randomIndex];
    var move = game.move(randMove);

    playerMove = move;
    // console.log(game.fen());
    // board.position(game.fen());
    console.log(game.insufficient_material());
    checkDraw();
    setTimeout(function () {
        makeEngineMove(playerMove);
    }, 10);

};




var makeEngineMove = function (playerMove) {

    var legalMoves = game.moves();
    var captureArray = [];

    console.log(legalMoves);

    // game over
    if (legalMoves.length === 0) {
        $("#gameStatus").html("GAME OVER");
        return;
    };
    var randomIndex = Math.floor(Math.random() * legalMoves.length);
    var engineMove = legalMoves[randomIndex];
    var n = legalMoves.length;
    for (var i = 0; i < n; i++) {
        if (legalMoves[i].includes("x")) {
            captureArray.push(legalMoves[i]);
        }
    }

    if (captureArray.length != 0) {
        var randomIndex = Math.floor(Math.random() * captureArray.length);
        var engineMove = captureArray[randomIndex];
    } else {
        var randomIndex = Math.floor(Math.random() * legalMoves.length);
        var engineMove = legalMoves[randomIndex];

    }

    var blackMove = game.move(engineMove, {
        sloppy: true
    });
    board.position(game.fen());
    if (motion === true) {
        setTimeout(randomMove, 10);
    }

};

function checkDraw() {
    switch (true) {
        case game.insufficient_material():
            console.log('its true');
            break;
        default:
            console.log('game is not a draw');
    }

}