var game = new Chess();
// right now for a depth of three it won't be able to check 3 rep 
console.log(game.fen());
// establish a Perft (Performance test)

var perftLeafNodes = 0; // will keep track of the total leaf nodes visited

var plyOne;
var plyOneCounter = 0;
var plyOneLegalMoves;
var plyOneLegalMovesLength = 0;

var plyTwo;
var plyTwoCounter = 0;
var plyTwoLegalMoves;
var plyTwoLegalMovesLength = 0;




PerftTest();

function PerftTest() {
	getPlyOneLegalMoves();
}

function getPlyOneLegalMoves() {
	plyOneLegalMoves = game.moves({
		verbose: true
	});
	plyOneLegalMovesLength = plyOneLegalMoves.length;
	console.log(plyOneLegalMoves);
	plyOneMove();

}

function plyOneMove() {

	var listMove = plyOneLegalMoves[plyOneCounter];
	var source = listMove.from;
	var target = listMove.to;
	var move = game.move({
		from: source,
		to: target,
		promotion: 'q'
	});



	if (plyOneCounter < plyOneLegalMovesLength) {

		getPlyTwoLegalMoves();
	}
	plyOneCounter++;
	logNodes();



}


function getPlyTwoLegalMoves() {
	plyTwoLegalMoves = game.moves({
		verbose: true
	});
	plyTwoLegalMovesLength = plyTwoLegalMoves.length;
	plyTwoMove();
}



function plyTwoMove() {

	plyTwoCounter = 0;
	while (plyTwoCounter < plyTwoLegalMovesLength) {
		var listMove = plyTwoLegalMoves[plyTwoCounter];
		var source = listMove.from;
		var target = listMove.to;
		var move = game.move({
			from: source,
			to: target,
			promotion: 'q'
		});
		plyTwoCounter++;
		perftLeafNodes++;
		takeBackMove();

	}

	takeBackMove();
	plyOneMove();

}





// while (plyTwoCounter < plyTwoLength) {
// 	takeBackMove();


// }







// function depthThreeMove() {
// 	var legalMoves = game.moves({
// 		verbose: true
// 	});

// 	var plyThreeLength = legalMoves.length;
// 	var listMove = legalMoves[plyThreeCounter];
// 	var source = listMove.from;
// 	var target = listMove.to;
// 	var move = game.move({
// 		from: source,
// 		to: target,
// 		promotion: 'q'
// 	});
// 	plyThreeCounter++;
// 	perftLeafNodes++;
// 	logNodes();
// }

function logNodes() {
	console.log('nodes visited: ' + perftLeafNodes);
}




function takeBackMove() {
	var undoPosition = game.undo();


}