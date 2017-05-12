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
    checkCapture(game, color);
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
    checkCapture(game, color);



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


function checkCapture(game, color) {


    console.log(move.captured);

    if (move.flags.includes("c") || move.flags.includes("e")) {
        var shortColor;
        var lowerPiece = move.captured;
        var piece = lowerPiece.toUpperCase();
        var imageOutput;
        var pieceType;

        if (piece === 'P') {
            pieceType = "Pawn";
        } else {
            pieceType = "Other";
        }
        constructImageOutput()

        function constructImageOutput() {
            if (color === "white") {
                shortColor = 'b';
            } else {
                shortColor = 'w';
            }


            switch (piece) {
                case 'P':
                    imageOutput = shortColor + 'P';
                    break;
                case 'N':
                    imageOutput = shortColor + 'N';
                    break;
                case 'B':
                    imageOutput = shortColor + 'B';
                    break;
                case 'R':
                    imageOutput = shortColor + 'R';
                    break;
                case 'Q':
                    imageOutput = shortColor + 'Q';
                    break;
            }
            console.log(imageOutput);

        }

        $('#' + color + pieceType).append("<img class='capturedPiece' alt='capturedPiece' src='./img/chesspieces/wikipedia/" + imageOutput + ".png'>");

    }
}