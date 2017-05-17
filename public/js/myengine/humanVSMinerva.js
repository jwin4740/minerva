var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true || gameStart === false ||
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
        promotion: 'q',
    });

    if (move === null) return 'snapback';
    getMaterialScores(game);
    console.log("Score after white move: " + GameScore.searchScore);


};


var onSnapEnd = function () {
    board.position(game.fen());
    hisArray = game.history();
    console.log(hisArray);
    var n = hisArray.length;
    var history = '';
    var counterMod = 0;
    for (var i = 0; i < n; i++) {
        counterMod++;
        if (counterMod % 2 != 0) {
            history += " .... ";
        }
        history += hisArray[i] + " ";

    }
    $('#gameHistory').html(history);
    setTimeout(makeEngineMove, 200);

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
        // var bestMove = getEngineMove(game);
        // game.ugly_move(bestMove);
    } else {
        var bestMove = getEngineMove(game);
        game.ugly_move(bestMove);
    }

    board.position(game.fen());
    hisArray = game.history();
    var n = hisArray.length;
    var history = '';
    var counterMod = 0;
    for (var i = 0; i < n; i++) {
        counterMod++;

        history += hisArray[i] + " ";
        if (counterMod % 2 === 0) {
            history += " .... ";
        }

    }
    $('#gameHistory').html(history);




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

$('#setFen').on("click", function () {
    var fenVal = $('#fenInput').val().trim();
    console.log(fenVal);
    game = new Chess(fenVal);
    board.position(game.fen());
    // startPos = fenVal;
    // cfg.position = startPos;
    // board = ChessBoard('board', cfg);
    // hisArray = ["a", "b", "c"];
    $('#fenInput').val('');
});

$('#startGame').on('click', function () {
    gameStart = true;

    $('#startGame').remove();


});