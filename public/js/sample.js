var board;
var game = new Chess();
var PawnTable = [
    0, 0, 0, 0, 0, 0, 0, 0,
    10, 10, 0, -10, -10, 0, 10, 10,
    5, 0, 0, 5, 5, 0, 0, 5,
    0, 0, 10, 20, 20, 10, 0, 0,
    5, 5, 5, 10, 10, 5, 5, 5,
    10, 10, 10, 20, 20, 10, 10, 10,
    20, 20, 20, 30, 30, 20, 20, 20,
    0, 0, 0, 0, 0, 0, 0, 0
];


var KnightTable = [
    0, -10, 0, 0, 0, 0, -10, 0,
    0, 0, 0, 5, 5, 0, 0, 0,
    0, 0, 10, 10, 10, 10, 0, 0,
    0, 0, 10, 20, 20, 10, 5, 0,
    5, 10, 15, 20, 20, 15, 10, 5,
    5, 10, 10, 20, 20, 10, 10, 5,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
];

var BishopTable = [
    0, 0, -10, 0, 0, -10, 0, 0,
    0, 0, 0, 10, 10, 0, 0, 0,
    0, 0, 10, 15, 15, 10, 0, 0,
    0, 10, 15, 20, 20, 15, 10, 0,
    0, 10, 15, 20, 20, 15, 10, 0,
    0, 0, 10, 15, 15, 10, 0, 0,
    0, 0, 0, 10, 10, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
];

var RookTable = [
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    0, 0, 5, 10, 10, 5, 0, 0,
    25, 25, 25, 25, 25, 25, 25, 25,
    0, 0, 5, 10, 10, 5, 0, 0
];



$('#resetBtn').on("click", function () {
    console.log("clicked");
    $("#gameStatus").html("");
    game.reset();
})

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};
var counter = 0;
var makeRandomMove = function () {
    counter++;
    var possibleMoves = game.moves();
    console.log(possibleMoves.length);
    console.log(possibleMoves);

    // game over
    if (possibleMoves.length === 0) {
        $("#gameStatus").html("GAME OVER");
        return
    };


    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);


    // var tempmove1 = "g8f6";
    // var tempmove2 = "d7d6";
    // var tempmove3 = "b8d7";
    // if (counter === 1) {
    //     var sloppyMove = (game.move(tempmove1, {
    //         sloppy: true
    //     }));
    // }
    // if (counter === 2) {
    //     var sloppyMove = (game.move(tempmove2, {
    //         sloppy: true
    //     }));
    // }
    // if (counter === 3) {
    //     var sloppyMove = (game.move(tempmove3, {
    //         sloppy: true
    //     }));
    // }
    // console.log(sloppyMove.san);


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

    // make random legal move for black
    window.setTimeout(makeRandomMove, 250);
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
    board.position(game.fen());

};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);
$('#clearBtn').on('click', board.clear);
$('#startBtn').on('click', board.start);

console.log(GameBoard.posKey)