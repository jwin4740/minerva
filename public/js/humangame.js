var board;
var blueMove;
var game = new Chess();
var whiteSanMove;
var blackSanMove;
var userColor = "white";
var movePar;
var grayRow = 0;
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

$('#resetBtn').on("click", function () {
    console.log("clicked");
    $("#gameStatus").html("");
    game.reset();
})


var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true) {
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
}
else {
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

console.log(GameBoard.posKey);