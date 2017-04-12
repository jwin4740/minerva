// this file is not necessary for the program to run, it is just used for checking
// the move generator

// for starting FEN position Perft(1) = 20 because there are 20 moves white can legally make
// so Perft(2) = 400 because black can also make 20 legal moves
var perft_leafNodes;

function Perft(depth) { 	

	if(depth == 0) {
        perft_leafNodes++;
        return;
    }	
    
    GenerateMoves();
    
	var index;
	var move;
	
	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
	
		move = GameBoard.moveList[index];	
		if(MakeMove(move) == BOOL.FALSE) {
			continue;
		}		
		Perft(depth-1);
		TakeMove();
	}
    
    return;
}
/* 

a2a3: 450000 leaf nodes			if Sharper had the same nodes here
a2a4: 600000leaf nodes			if Sharper had the same nodes here
b3b4: 756486 leaf nodes			if Sharper had different number of nodes you can go sequentially go back to depth 0 to figure where you went wrong

Perft(5) from start is 4865609 leaf nodes 
	-- if your engine does not get that number than it is helpful to know where to find the bug
*/

function PerftTest(depth) {    

	PrintBoard();
	console.log("Starting Test To Depth:" + depth);	
	perft_leafNodes = 0;

	var index;
	var move;
	var moveNum = 0;
	for(index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
	
		move = GameBoard.moveList[index];	
		if(MakeMove(move) == BOOL.FALSE) {
			continue;
		}	
		moveNum++;	
        var cumnodes = perft_leafNodes;  // cumulative nodes
		Perft(depth-1);
		TakeMove();
		var oldnodes = perft_leafNodes - cumnodes;
        console.log("move:" + moveNum + " " + PrMove(move) + " " + oldnodes);
	}
    
	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");      

    return;

}

