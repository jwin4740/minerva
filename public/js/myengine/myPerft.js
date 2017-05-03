var game = new Chess();

// establish a Perft (Performance test)
var possibleMoves;
var n;
var ply = 1;
var whiteCounter = 0;
var blackCounter = 0;
var perftLeafNodes = 0; // will keep track of the total leaf nodes visited
var rootLegalMoves;


getRootLegalMoves();

function getRootLegalMoves() {
	rootLegalMoves = game.moves({
		verbose: true
	});
	whiteMove();

}

function whiteMove() {

	while (whiteCounter < rootLegalMoves.length) {
		var listMove = rootLegalMoves[whiteCounter];
		var source = listMove.from;
		var target = listMove.to;
		var move = game.move({
			from: source,
			to: target,
			promotion: 'q'
		});

		// console.log(move);
		// console.log(game.ascii());
		whiteCounter++;
		// perftLeafNodes++;
		// console.log(move.san);
		console.log(game.fen());
		blackMove();
	}


}

function blackMove() {
	var legalMoves = game.moves({
		verbose: true
	});
	// console.log(legalMoves);
	do {

		var listMove = legalMoves[blackCounter];
		var source = listMove.from;
		var target = listMove.to;


		var move = game.move({
			from: source,
			to: target,
			promotion: 'q'
		});
		blackCounter++;
		perftLeafNodes++;
		// console.log(move.san);
		// console.log(game.fen());

		takeBackMove();
	}
	while (blackCounter < legalMoves.length);
	blackCounter = 0;
	console.log('nodes visited: ' + perftLeafNodes);
	takeBackMove();
	// console.log(game.fen());
	whiteMove();


}















function takeBackMove() {
	var undoPosition = game.undo();
	// console.log(undoPosition);

}