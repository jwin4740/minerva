var Chess = require('./chess').Chess;
var chess = new Chess();
var moveCounter = 0;



while (!chess.game_over()) {
    moveCounter++;
    var moves = chess.moves();
    var move = moves[Math.floor(Math.random() * moves.length)];
    chess.move(move);
    var randPosition = chess.ascii();
    if (moveCounter > 1) {
        console.log(randPosition);
        return;
    }

}
console.log(chess.pgn());