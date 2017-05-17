var arrayCounter = 0;
var hisArray = [];


function getMaterialScores(game) {
    tempMaterialArray = [];
    GameScore.blackMaterial = 0;
    GameScore.whiteMaterial = 0;
    GameScore.searchScore = 0;
    GameScore.whiteScore = 0;
    GameScore.blackScore = 0;

    for (var i = 1; i < 9; i++) {
        for (var m = 97; m < 105; m++) {
            var kar = String.fromCharCode(m);
            var square = kar + i;
            var piece = game.get(square);
            tempMaterialArray.push(piece);
        }
    }


    // black knight
    //TODO: why missing first black knight

    for (var i = 8; i > 0; i--) {
        for (var m = 97; m < 105; m++) {
            var kar = String.fromCharCode(m);
            var square = kar + i;
            var piece = game.get(square);
            if (piece == null) {
                arrayCounter++;
                continue;
            }
            switch (true) {
                case piece.type === "p" && piece.color === "b":
                    GameScore.blackScore += blackPawnTable[arrayCounter];
                    break;
                case piece.type === "n" && piece.color === "b":
                    GameScore.blackScore += blackKnightTable[arrayCounter];
                    break;
                case piece.type === "q" && piece.color === "b":
                    GameScore.blackScore += blackQueenTable[arrayCounter];
                    break;
                case piece.type === "k" && piece.color === "b":
                    GameScore.blackScore += blackKingTable[arrayCounter];
                    break;
                case piece.type === "p" && piece.color === "w":
                    GameScore.whiteScore += whitePawnTable[arrayCounter];
                    break;
                case piece.type === "n" && piece.color === "w":
                    GameScore.whiteScore += whiteKnightTable[arrayCounter];
                    break;
                case piece.type === "q" && piece.color === "w":
                    GameScore.whiteScore += whiteQueenTable[arrayCounter];
                    break;



            }
            arrayCounter++;

        }
    }

    GameScore.searchScore += (GameScore.whiteScore - GameScore.blackScore) / 100;


    var n = tempMaterialArray.length;
    for (var i = 0; i < n; i++) {
        if (tempMaterialArray[i] != null) {
            var pieceCode = tempMaterialArray[i].color + (tempMaterialArray[i].type).toUpperCase();
            if (pieceCode.includes('w')) {
                GameScore.whiteMaterial += pieceObject[pieceCode].value;

            } else {
                GameScore.blackMaterial += pieceObject[pieceCode].value;

            }
        }

    }
    GameScore.searchScore += (GameScore.whiteMaterial - GameScore.blackMaterial) / 100;

    if (game.in_checkmate()) {
        console.log('checkmate');
        GameScore.searchScore = 100000;
    }


    arrayCounter = 0;
    return GameScore.searchScore;
}




var alphaBetaSearchRoot = function (depth, game, isMaximisingPlayer) {
    var captureArray = [];
    var noCaptureArray = [];

    var newGameMoves = game.ugly_moves();
    var x = newGameMoves.length;

    for (var i = 0; i < x; i++) {
        if (newGameMoves[i].flags === 2) {
            captureArray.push(newGameMoves[i]);
        } else {
            noCaptureArray.push(newGameMoves[i]);
        }
    }

    var n = noCaptureArray.length;

    for (var i = 0; i < n; i++) {
        captureArray.push(noCaptureArray[i]);
    }


    console.log(captureArray);

    var moveLen = captureArray.length;


    var bestMove = -9999;
    var bestMoveFound;

    for (var i = 0; i < moveLen; i++) {
        var newGameMove = captureArray[i];
        game.ugly_move(newGameMove);
        var value = alphaBetaSearch(depth - 1, game, -10000, 10000, !isMaximisingPlayer);
        game.undo();
        if (value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }
    return bestMoveFound;
};

var alphaBetaSearch = function (depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {

        var myScore = -1 * (getMaterialScores(game));
        tempScoreArray.push(myScore);
        return myScore;
    }

    var newGameMoves = game.ugly_moves();

    if (isMaximisingPlayer) {
        var bestMove = -9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.max(bestMove, alphaBetaSearch(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            alpha = Math.max(alpha, bestMove);
            if (beta <= alpha) {

                return bestMove;
            }
        }
        return bestMove;
    } else {
        var bestMove = 9999;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.ugly_move(newGameMoves[i]);
            bestMove = Math.min(bestMove, alphaBetaSearch(depth - 1, game, alpha, beta, !isMaximisingPlayer));
            game.undo();
            beta = Math.min(beta, bestMove);
            if (beta <= alpha) {

                return bestMove;
            }
        }
        return bestMove;
    }
};
var rawHistArray = [];

function getEngineMove() {


    // TODO: engine slows down a lot slightly after opening
    if (game.game_over()) {
        alert('Game over');
    }
    positionCount = 0;
    // GameScore.searchScore = GameScore.currentScore;
    var startTime = moment().valueOf();

    var bestMove = alphaBetaSearchRoot(3, game, true);
    var stopTime = moment().valueOf();
    var totalTime = stopTime - startTime;
    var totalTimeSeconds = totalTime / 1000;;
    var nodeRateRaw = positionCount / totalTimeSeconds;
    var nodeRate = nodeRateRaw.toFixed(0);

    GameScore.currentScore = GameScore.searchScore;
    console.log(GameScore.currentScore);
    $('#depthOutput').html(3);
    $('#nodeRateOutput').html(nodeRate);
    $('#nodesVisitedOutput').html(positionCount);
    $('#scoreOutput').html(GameScore.currentScore);
    rawHistArray = game.history();
    console.log(rawHistArray);
    $('#bodyBestLine').html(game.history());


    searchMode = false;
    return bestMove;
}


function firstMoveFunct(game) {

    // for opening black move it's hardcoded
    switch (true) {
        case hisArray[0] === "e4":
            var bestMove = "e5";
            break;
        case hisArray[0] === "d4":
            var bestMove = "d5";
            break;
        case hisArray[0] === "Nf3":
            var bestMove = "Nc6";
            break;
        case hisArray[0] === "Nc3":
            var bestMove = "Nf6";
            break;
        case hisArray[0] === "e3":
            var bestMove = "e5";
            break;
        case hisArray[0] === "d3":
            var bestMove = "e5";
            break;
        default:
            var bestMove = "e6";

    }

    return bestMove;

}



/* capture only engine -----------------------------------------

function getEngineMove() {
    // alphaBetaSearchRoot(2, game, true);
    var captureArray = [];
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
        engineSource = engineMove.from;
        engineTarget = engineMove.to;
    } else {
        var randomIndex = Math.floor(Math.random() * legalMoves.length);
        var engineMove = legalMoves[randomIndex];
        engineSource = engineMove.from;
        engineTarget = engineMove.to;
    }
    return;

}

*/


// hash map   hash table     hash string   why does hashing strings work






















// most valuable victim and least valuable attacker
// so any moves that capture a queen searched first, then rook ...
// those moves themselves are searched against the least valuable attacker i.e. pawn capture queen
// pawn is 100   knight 200   bishop 300   rook 400   queen 500   king 600
const mvvLvaValue = [0, 100, 300, 300, 500, 500, 600, 100, 200, 300, 400, 500, 600];


// function InitMvvLva() {
//     var Attacker;
//     var Victim;
//     for (Attacker = PIECES.wP; Attacker <= PIECES.bK; ++Attacker) {
//         for (Victim = PIECES.wP; Victim <= PIECES.bK; ++Victim) {
//             MvvLvaScores[Victim * 14 + Attacker] = MvvLvaValue[Victim] + 6 - (MvvLvaValue[Attacker] / 100);
//             // example: pawn captures queen       506 - 100/100 = 505
//         }
//     }

// }

// employ mvv-lva heuristic