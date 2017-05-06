var engineSource;
var engineTarget;
var roundedScore;
var game = new Chess();
var move;
var board;
const pieceObject = {
    empty: 0,
    wP: {
        index: 1,
        value: 100
    },
    wN: {
        index: 2,
        value: 300
    },
    wB: {
        index: 3,
        value: 300
    },
    wR: {
        index: 4,
        value: 500
    },
    wQ: {
        index: 5,
        value: 900
    },
    wK: {
        index: 6,
        value: 1
    },
    bP: {
        index: 7,
        value: 100
    },
    bN: {
        index: 8,
        value: 300
    },
    bB: {
        index: 9,
        value: 300
    },
    bR: {
        index: 10,
        value: 500
    },
    bQ: {
        index: 11,
        value: 900
    },
    bK: {
        index: 12,
        value: 1
    }
};


var GameScore = {};
var positionCount = 0;
GameScore.blackMaterial = 0;
GameScore.whiteMaterial = 0;
GameScore.startingScore = 0;
GameScore.currentScore = 0;
GameScore.captureScore = 0;
GameScore.mvvLvaScores = []; // every combination of victim and attacker will have their individual index




function updateMaterial(captured) {

    if (captured.includes("w")) {

        GameScore.blackMaterial += pieceObject[captured].value;

    } else {
        GameScore.whiteMaterial += pieceObject[captured].value;
    }

}






var outputArray = [];

function updateCurrentScore() {

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
        GameScore.blackMaterial += pieceObject[captured].value;
        GameScore.whiteMaterial += pieceObject[captured].value;
    }


    GameScore.currentScore = (GameScore.whiteMaterial - GameScore.blackMaterial) / 100;
    roundedScore = GameScore.currentScore;
    // $("#scoreRunway").html(roundedScore);
    // outputArray.push(roundedScore);
    return roundedScore;

}

var minimaxRoot = function (depth, game, isMaximisingPlayer) {


    var newGameMoves = game.moves();
    var bestMove = Number.NEGATIVE_INFINITY;
    var bestMoveFound;

    for (var i = 0; i < newGameMoves.length; i++) {
        var newGameMove = newGameMoves[i]
        game.move(newGameMove);
        var value = minimax(depth - 1, game, !isMaximisingPlayer);
        game.undo();
        if (value >= bestMove) {
            bestMove = value;
            bestMoveFound = newGameMove;
        }
    }

    return bestMoveFound;
};

var minimax = function (depth, game, isMaximisingPlayer) {
    positionCount++;
    if (depth === 0) {
        var curScore = updateCurrentScore();
        console.log(curScore);
        return curScore;

    }

    var newGameMoves = game.moves();

    if (isMaximisingPlayer) {
        var bestMove = Number.NEGATIVE_INFINITY;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            bestMove = Math.max(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
            game.undo();

        }
        return bestMove;
    } else {
        var bestMove = Number.POSITIVE_INFINITY;
        for (var i = 0; i < newGameMoves.length; i++) {
            game.move(newGameMoves[i]);
            bestMove = Math.min(bestMove, minimax(depth - 1, game, !isMaximisingPlayer));
            game.undo();
        }

        return bestMove;
    }
};











function getEngineMove() {



    minimaxRoot(2, game, true);


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
function captureBest() {

}
var lineArray = [];
var bestScore = 0;
var tempScore = 0;
var startingDepthArray = [];
var initCounter = 0;
var roundedScore = 0;










function evaluateLines(depth) {

    if (startingDepthArray.length < 1) {
        startingDepthArray.push(depth);
    }
    var legalMoves = game.moves();
    var len = legalMoves.length;
    var nodes = 0;
    var color = game.turn();

    //TODO: why is it taking longer to calculate
    for (var i = 0; i < len; i++) {
        game.move(legalMoves[i]);

        if (depth === 1) {
            var position = game.fen();
            lineArray.push(bestScore);
            // if (bestScore >= parseInt(roundedScore)) {
            //     if (move.flags.includes("c") || move.flags.includes("e")) {
            //         bestScore = parseInt(updateMaterial());
            //         roundedScore = bestScore;
            //     }
            // }

        }
        // console.warn(moves[i]);
        //   if (!king_attacked(color)) {
        if (depth - 1 > 0) {
            var child_nodes = evaluateLines(depth - 1);
            nodes += child_nodes;
        } else {
            nodes++;
        }
        //   }
        game.undo()
    }

    return nodes;

}