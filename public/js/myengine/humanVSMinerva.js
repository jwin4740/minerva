var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var onDrop = function (source, target) {
    // see if the move is legal
    color = 'white';
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q',
    });

    if (move === null) return 'snapback';
    getMaterialScores(game);
    console.log("Score after white move: " + GameScore.searchScore);


};


var onSnapEnd = function () {
    board.position(game.fen());
    hisArray = game.history();
    setTimeout(makeEngineMove, 50);

};

function makeEngineMove() {
    color = 'black';
    //TODO: settimeout not working; get a little delay before first move
    if (hisArray.length > 6) {
        blackQueenTable[3] = 0;
    }
    if (hisArray.length < 2) {
        var bestMove = firstMoveFunct(game);
        game.move(bestMove);
    } else {
        var bestMove = getEngineMove(game);
        game.ugly_move(bestMove);
    }

    board.position(game.fen());



}


var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    orientation: 'white',
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);