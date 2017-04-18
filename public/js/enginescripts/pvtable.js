/*

PvTable[10000]

entry has posKey and move stored

(because we found a move that beats alpha)
index = posKey % 10000;

PvTable[index].move = move from alpha-beta   posKey = GameBoard.posKey

*/



// get the move at root from the pvtable make that move, get the next move from the pv table ...
function GetPvLine(depth) {
	
	var move = ProbePvTable();
	var count = 0;
	
	while(move != NOMOVE && count < depth) {
	
		if( MoveExists(move) == BOOL.TRUE) {
			MakeMove(move);
			GameBoard.PvArray[count++] = move;			
		} else {
			break;
		}		
		move = ProbePvTable();	
	}
	
	while(GameBoard.ply > 0) {
		TakeMove();
	}
	
	return count;
	
}



function ProbePvTable() {
	var index = GameBoard.posKey % PVENTRIES;
	
	// we know we that we can return that move because it beat alpha
	if(GameBoard.PvTable[index].posKey == GameBoard.posKey) {
		return GameBoard.PvTable[index].move;
	}
	
	return NOMOVE;
}

function StorePvMove(move) {
	var index = GameBoard.posKey % PVENTRIES;
	GameBoard.PvTable[index].posKey = GameBoard.posKey;
	GameBoard.PvTable[index].move = move;
}