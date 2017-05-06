// do not pick up pieces if the game is over
// only pick up pieces for White



var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var onDrop = function (source, target) {
    // see if the move is legal
    color = 'white';
    move = game.move({
        from: source,
        to: target,
        promotion: 'n'
    });

    console.log(move);
    // illegal move
    if (move === null) return 'snapback';

    checkStatus(move, color);


};


var onSnapEnd = function () {
    board.position(game.fen());
};

function makeEngineMove() {
    getEngineMove();
    move = game.move({
        from: engineSource,
        to: engineTarget,
        promotion: 'q'
    });




    board.position(game.fen());
    color = 'black';
    console.log(move.flags);
    checkStatus(move, color);
}




function checkStatus(move, color) {

    if (color === "white") {
        if (move.flags.includes("c") || move.flags.includes("e")) {
            var capturedColor;
            var shortColor;
            var shortCapturedColor;
            var shortNotation;
            var lowerPiece = move.captured;
            var piece = lowerPiece.toUpperCase();
            var imageOutput;
            var pieceType;

            if (color === "white") {
                capturedColor = "black";
                shortCapturedColor = "b";
            } else {
                capturedColor = "white";
                shortCapturedColor = "w";
            }
            shortNotation = shortCapturedColor + piece;
            updateMaterial(shortNotation);
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

    switch (true) {
        case game.game_over():
            motion = false;
            gameOverReason(color);
            break;
        case color === "white":

            window.setTimeout(makeEngineMove, 1000);
            break;
        default:
            break;
    }

}

function gameOverReason(color) {
    switch (true) {
        case game.in_stalemate():
            reason = 'stalemate';
            appendResult(color, reason);
            break;
        case game.in_threefold_repetition():
            reason = 'threeFoldRep';
            appendResult(color, reason);
            break;
        case game.insufficient_material():

            reason = 'insufficient material';
            appendResult(color, reason);
            break;
        case game.in_checkmate():
            reason = 'checkmate'
            appendResult(color, reason);
            break;
    }

}

function appendResult(color, reason) {
    switch (reason) {
        case 'stalemate':
            console.log(reason);
            drawCount++;
            if (color === 'white') {
                whiteStalemateCount++;
                $("#draws").html(drawCount);
                $("#whiteStalemate").html(whiteStalemateCount);

            } else {
                blackStalemateCount++;
                $("#draws").html(drawCount);
                $("#blackStalemate").html(blackStalemateCount);
            }
            break;
        case 'threeFoldRep':
            console.log(reason);
            drawCount++;
            threefoldCount++;
            $("#draws").html(drawCount);
            $("#threefold").html(threefoldCount);
            break;
        case 'insufficient material':
            console.log(reason);
            drawCount++;
            insufficientMaterialCount++;
            $("#draws").html(drawCount);
            $("#insufficient").html(insufficientMaterialCount);
            break;
        case 'checkmate':
            if (color === 'white') {
                whiteWinCount++;
                $("#whiteWins").html(whiteWinCount);
            } else {
                blackWinCount++;
                $("#blackWins").html(blackWinCount);
            }
            console.log(reason);
            break;
    }
    newGameAgain();
}

function newGameAgain() {
    board.clear();
    game = new Chess();
    board.start();
    motion = true;
    return;
}

$('#setFen').on('click', function () {

    var fenVal = $('#fenInput').val().trim();
    game = new Chess(fenVal);
    board.position(fenVal);
    startPos = fenVal;

    var move = game.move({
        from: 'h4',
        to: 'g4',
        promotion: 'q'
    });
    board.position(game.fen());
    $('#fenInput').val('');
});



var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    orientation: 'white',
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);