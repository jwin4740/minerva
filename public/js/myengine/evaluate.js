var engineSource;
var engineTarget;
var roundedScore;
var game = new Chess();
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
    updateCurrentScore();
}

function updateCurrentScore() {
    GameScore.currentScore = (GameScore.whiteMaterial - GameScore.blackMaterial) / 100;
    roundedScore = GameScore.currentScore.toFixed(2);
    $("#scoreRunway").html(roundedScore);
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
var line = "";
var startingDepthArray = [];
var initCounter = 0;

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

        line += " " + legalMoves[i];
        if (depth === 1) {
            line += " " + legalMoves[i];
            lineArray.push(line);
            line = "";
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


        game.undo();


    }

    return nodes;
    initCounter = 0;
}




function getEngineMove() {
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