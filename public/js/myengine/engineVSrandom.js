// $('#resetBtn').on("click", function () {
//     console.log("clicked");
//     $("#gameStatus").html("");
//     game.reset();
// })
var playerMove;
var drawCount = 0;
var whiteWinCount = 0;
var blackWinCount = 0;
var drawReason;
var insufficientMaterialCount = 0;
var whiteStalemateCount = 0;
var blackStalemateCount = 0;
var threefoldCount = 0;
// do not pick up pieces if the game is over
// only pick up pieces for White
var color;
var motion = true;
var startPos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';


var cfg = {
    position: 'start',
    orientation: 'white',


};
board = ChessBoard('board', cfg);


$("#start").on('click', function () {
    var turn = game.turn();
    if (turn === 'w') {
        randomWhiteMove();


    } else {
        makeEngineMove();
    }
});


$("#pause").on('click', function () {
    motion = false;
});

function randomWhiteMove() {

    var legalMoves = game.moves({
        verbose: true
    });
    var randomIndex = Math.floor(Math.random() * legalMoves.length);
    var randMove = legalMoves[randomIndex];
    var source = randMove.from;
    var target = randMove.to;


    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    playerMove = move;
    // board.position(game.fen());
    color = "white";
    checkStatus(color);



};




var makeEngineMove = function () {
    var captureArray = [];
    var tempMoves = game.moves();

    var legalMoves = game.moves({
        verbose: true
    });



    // game over

    var n = legalMoves.length;

    for (var i = 0; i < n; i++) {
        if (legalMoves[i].flags.includes("c")) {
            captureArray.push(legalMoves[i]);
        }
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
    // board.position(game.fen());
    color = 'black';
    checkStatus(color);
};

function checkStatus(color) {
    switch (true) {
        case game.game_over():
            motion = false;
            gameOverReason(color);
            break;
        case color === 'white':
            if (motion === true) {
                setTimeout(function () {
                    makeEngineMove();
                }, 10);
            }
            break;
        case color === 'black':
            if (motion === true) {
                setTimeout(function () {
                    randomWhiteMove();
                }, 10);
            }
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
    randomWhiteMove();
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
    // board.position(game.fen());
    $('#fenInput').val('');


});