var game = new Chess();


$('#resetBtn').on("click", function () {
    console.log("clicked");
    $("#gameStatus").html("");
    game.reset();
});




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
    var move = game.move({
        from: source,
        to: target,
        promotion: 'n'
    });
    console.log(move);
    // illegal move
    if (move === null) return 'snapback';
    window.setTimeout(makeEngineMove, 500);
};


var onSnapEnd = function () {
    board.position(game.fen());
};

function makeEngineMove() {
    console.log("move it");
    var captureArray = [];
    var tempMoves = game.moves();

    var legalMoves = game.moves({
        verbose: true
    });
    var n = legalMoves.length;

    for (var i = 0; i < n; i++) {
        // TODO: add heuristics (mvv-lva, ...)
        if (legalMoves[i].flags.includes("c")) {
            captureArray.push(legalMoves[i]);
        }
        // TODO: function*(move) -> generate fen, calculate value of board
    }
    if (captureArray.length != 0) {
        var randomIndex = Math.floor(Math.random() * captureArray.length);
        var engineMove = captureArray[randomIndex];
        var source = engineMove.from;
        var target = engineMove.to;
    } else {
        var randomIndex = Math.floor(Math.random() * legalMoves.length);
        var engineMove = legalMoves[randomIndex];
        var source = engineMove.from;
        var target = engineMove.to;

    }
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });
    board.position(game.fen());
    color = 'black';
    console.log(game.history());
    checkStatus(color);
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

function checkStatus(color) {
    switch (true) {
        case game.game_over():
            motion = false;
            gameOverReason(color);
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