// $('#resetBtn').on("click", function () {
//     console.log("clicked");
//     $("#gameStatus").html("");
//     game.reset();
// })

// do not pick up pieces if the game is over
// only pick up pieces for White

var game = new Chess();
var startPos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};



var onDrop = function (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
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

    var legalMoves = game.moves({
        verbose: true
    });
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
        if (legalMoves[i].san.includes("x")) {
            captureArray.push(legalMoves[i]);
        }
    }

    if (captureArray.length != 0) {
        var randomIndex = Math.floor(Math.random() * captureArray.length);
         console.log(engineMove.piece);
        var engineMove = captureArray[randomIndex].san;
    
    } else {
        var randomIndex = Math.floor(Math.random() * legalMoves.length);
         console.log(engineMove.piece);
        var engineMove = legalMoves[randomIndex].san;
       

    }

    var blackMove = game.move(engineMove, {
        san: engineMove

    });
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



$('#setFen').on('click', function () {

    var fenVal = $('#fenInput').val().trim();
    game = new Chess(fenVal);
    board.position(fenVal);
    startPos = fenVal;
    $('#fenInput').val('');

});