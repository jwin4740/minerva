// $('#resetBtn').on("click", function () {
//     console.log("clicked");
//     $("#gameStatus").html("");
//     game.reset();
// })

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};


var makeEngineMove = function () {

    var possibleMoves = game.moves();
    console.log(possibleMoves.length);
    console.log(possibleMoves);

    // game over
    if (possibleMoves.length === 0) {
        $("#gameStatus").html("GAME OVER");
        return;
    };

    var blackMove = game.move(engineMove, {
        sloppy: true
    });
    board.position(game.fen());

};



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

    playerMove = move;
    setTimeout(function () {
        makeEngineMove(playerMove);
    }, 500);
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
    board.position(game.fen());

};



var makeEngineMove = function (playerMove) {

    var legalMoves = game.moves();

    console.log(legalMoves);

    // game over
    if (legalMoves.length === 0) {
        $("#gameStatus").html("GAME OVER");
        return;
    };
    var randomIndex = Math.floor(Math.random() * legalMoves.length);
    var engineMove = legalMoves[randomIndex];


    var blackMove = game.move(engineMove, {
        sloppy: true
    });
    board.position(game.fen());

};


var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    orientation: 'white',
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);
$('#clearBtn').on('click', board.clear);
$('#startBtn').on('click', board.start);