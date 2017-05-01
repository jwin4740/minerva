// $('#resetBtn').on("click", function () {
//     console.log("clicked");
//     $("#gameStatus").html("");
//     game.reset();
// })

// do not pick up pieces if the game is over
// only pick up pieces for White
var startPos = '6k1/8/5Q2/8/8/5N2/PP3P2/4R1K1 w - - 1 37';
var game = new Chess('6k1/8/5Q2/8/8/5N2/PP3P2/4R1K1 w - - 1 37');
var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var onDrop = function (source, target, flags) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        flags: flags

    });
    console.warn(move);
    // illegal move
    if (move === null) return 'snapback';

    playerMove = move;
    setTimeout(function () {
        makeEngineMove(playerMove);
    }, 500);
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
    if (game.in_check()) {
        console.warn("in check!!!");
    }
    if (game.in_checkmate()) {
        console.warn("in checkmate!!! white wins");
    }
    if (game.in_draw()) {
        console.warn("in draw!!!!");
    }
    console.log(game.fen());
    board.position(game.fen());


};



var makeEngineMove = function (playerMove) {
    var captureArray = [];
    var legalMoves = game.moves();
    var captureMoveCount = 0;
    console.log(legalMoves);
    console.warn("there are " + legalMoves.length + " legal moves!!!!!!!");

    // game over
    if (legalMoves.length === 0) {
        $("#gameStatus").html("GAME OVER");
        return;
    };

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

    // var engineMove = legalMoves[randomIndex];



    var blackMove = game.move(engineMove, {
        sloppy: true
    });
 console.log(game.fen());
    if (game.in_check()) {
        console.warn("in check!!!");
    }
    if (game.in_checkmate()) {
        console.warn("in checkmate!!!");
    }
    board.position(game.fen());



};


var cfg = {
    draggable: true,
    position: startPos,
    onDragStart: onDragStart,
    onDrop: onDrop,
    orientation: 'white',
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);

$('#clearBtn').on('click', board.clear);
$('#startBtn').on('click', board.start);