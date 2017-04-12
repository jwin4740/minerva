var feverOutput;
var SearchController = {};

SearchController.nodes; // number of nodes visited during a search
SearchController.fh;
SearchController.fhf;
SearchController.depth;
SearchController.time;
SearchController.start;
SearchController.stop;
SearchController.best;
SearchController.thinking;

function PickNextMove(MoveNum) {

	var index = 0; // index of current move
	var bestScore = -1;
	var bestNum = MoveNum; // best index of move found so far

	for (index = MoveNum; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {
		if (GameBoard.moveScores[index] > bestScore) {
			bestScore = GameBoard.moveScores[index];
			bestNum = index;
		}
	}
	// swapping positions in the array for the moveScore 
	// do the same for moveList
	if (bestNum != MoveNum) {
		var temp = 0;
		temp = GameBoard.moveScores[MoveNum];
		GameBoard.moveScores[MoveNum] = GameBoard.moveScores[bestNum];
		GameBoard.moveScores[bestNum] = temp;

		temp = GameBoard.moveList[MoveNum];
		GameBoard.moveList[MoveNum] = GameBoard.moveList[bestNum];
		GameBoard.moveList[bestNum] = temp;
	}

}

function ClearPvTable() {

	for (index = 0; index < PVENTRIES; index++) {
		GameBoard.PvTable[index].move = NOMOVE;
		GameBoard.PvTable[index].posKey = 0;
	}
}

function CheckUp() { // if we take more time than allowed we break out of search
	if (($.now() - SearchController.start) > SearchController.time) {
		SearchController.stop = BOOL.TRUE;
	}
}

function IsRepetition() {
	// checks for three repitition stalemate rule
	// a pawn move or capture  is a permanent change to the board position  
	var index = 0;

	for (index = GameBoard.hisPly - GameBoard.fiftyMove; index < GameBoard.hisPly - 1; ++index) {
		if (GameBoard.posKey == GameBoard.history[index].posKey) { // esssentially sees if our posKey is equal to a previous posKey
			return BOOL.TRUE;
		}
	}

	return BOOL.FALSE;
}

// very similar to alpha/beta function, but searching only captures
function Quiescence(alpha, beta) {
	// call checkup every 2047 nodes
	if ((SearchController.nodes & 2047) == 0) {
		CheckUp();
	}

	SearchController.nodes++;

	if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply != 0) {
		return 0;
	}

	if (GameBoard.ply > MAXDEPTH - 1) {
		return EvalPosition();
	}

	var Score = EvalPosition();

	if (Score >= beta) {
		return beta;
	}

	if (Score > alpha) {
		alpha = Score;
	}

	GenerateCaptures();

	var MoveNum = 0;
	var Legal = 0;
	var OldAlpha = alpha;
	var BestMove = NOMOVE;
	var Move = NOMOVE;

	for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {

		PickNextMove(MoveNum);

		Move = GameBoard.moveList[MoveNum];

		if (MakeMove(Move) == BOOL.FALSE) {
			continue;
		}
		Legal++;
		Score = -Quiescence(-beta, -alpha);

		TakeMove();

		if (SearchController.stop == BOOL.TRUE) {
			return 0;
		}

		if (Score > alpha) {
			if (Score >= beta) {
				if (Legal == 1) {
					SearchController.fhf++;
				}
				SearchController.fh++;
				return beta;
			}
			alpha = Score;
			BestMove = Move;
		}
	}

	if (alpha != OldAlpha) {
		StorePvMove(BestMove);
	}

	return alpha;

}

function AlphaBeta(alpha, beta, depth) {
	/* 
	
	general ordering as follows
	1. pv move
	2. capturing moves
	3. killer moves (because give us beta cutoffs)
	4. increment history counter

	*/



	// once we reach our depth we stop the search
	if (depth <= 0) {
		return Quiescence(alpha, beta); // implemented to eliminate the horizon effect

	}

	if ((SearchController.nodes & 2047) == 0) {
		CheckUp();
	}

	SearchController.nodes++;

	// check for 3 fold repetition and fifty move rule
	if ((IsRepetition() || GameBoard.fiftyMove >= 100) && GameBoard.ply != 0) {
		return 0;
	}
	// we only go to 63 if it hits 63 then evaluate function
	// note very rare that we ever get to depth 63
	if (GameBoard.ply > MAXDEPTH - 1) {
		return EvalPosition();
	}

	// are we in check?
	// if in check we will increment the depth because there are very limited moves to get out of check and there is 
	// a better possibility that a mate will follow
	var InCheck = SqAttacked(GameBoard.pList[PCEINDEX(Kings[GameBoard.side], 0)], GameBoard.side ^ 1);
	if (InCheck == BOOL.TRUE) {
		depth++;
	}

	var Score = -INFINITE;

	GenerateMoves();
	// for example if we have a best line for a depth of 6, when we got to depth 7 go down
	// that line first so we can get more cutoffs

	// get a PvMove (Principal variation)
	// Order PvMove


	var MoveNum = 0; //index
	var Legal = 0;
	var OldAlpha = alpha; // if we got through the loop with no alpha improvement
	var BestMove = NOMOVE;
	var Move = NOMOVE;

	var PvMove = ProbePvTable();

	// loop through generated moves and when we find a move that is a pv move, we give it a huge score
	if (PvMove != NOMOVE) {
		for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {
			if (GameBoard.moveList[MoveNum] == PvMove) {
				GameBoard.moveScores[MoveNum] = 2000000;
				break;
			}
		}
	}

	for (MoveNum = GameBoard.moveListStart[GameBoard.ply]; MoveNum < GameBoard.moveListStart[GameBoard.ply + 1]; ++MoveNum) {

		PickNextMove(MoveNum);

		Move = GameBoard.moveList[MoveNum];

		if (MakeMove(Move) == BOOL.FALSE) {
			continue;
		}
		Legal++;
		Score = -AlphaBeta(-beta, -alpha, depth - 1); // because of negamax

		TakeMove();

		if (SearchController.stop == BOOL.TRUE) {
			return 0;
		}

		if (Score > alpha) {
			if (Score >= beta) { // check for beta cutoff
				if (Legal == 1) { // if this happens it  means we got a beta cutoff right away and prunes a lot of nodes
					SearchController.fhf++;
				}
				SearchController.fh++;
				// fail high first (fhf) / fail high (fh) shows the percentage of beta cutoffs on first mvoes
				if ((Move & MFLAGCAP) == 0) {
					GameBoard.searchKillers[MAXDEPTH + GameBoard.ply] =
						GameBoard.searchKillers[GameBoard.ply];
					GameBoard.searchKillers[GameBoard.ply] = Move;
				}
				return beta;
			}

			// capturing moves most likely causes beta cutoff
			if ((Move & MFLAGCAP) == 0) {
				GameBoard.searchHistory[GameBoard.pieces[FROMSQ(Move)] * BRD_SQ_NUM + TOSQ(Move)] += depth * depth;
			}
			alpha = Score;

			// every time we improve alpha that makes the move better
			BestMove = Move;
		}
	}
	// check for checkmate
	if (Legal == 0) {
		if (InCheck == BOOL.TRUE) {
			return -MATE + GameBoard.ply; // tells us distance to mate from root i.e. mate in x moves
		} else {
			return 0;
		}
	}

	if (alpha != OldAlpha) {
		StorePvMove(BestMove);
	}

	return alpha; // represents best situation
}

function ClearForSearch() {
	// clears everything to get ready for search
	var index = 0;
	var index2 = 0;

	// this is our history heuristic, which is what gets incremented every time a move 
	// improves alpha for a non capturing move	
	for (index = 0; index < 14 * BRD_SQ_NUM; ++index) {
		GameBoard.searchHistory[index] = 0;
	}

	// a non capture move that beats beta	
	for (index = 0; index < 3 * MAXDEPTH; ++index) {
		GameBoard.searchKillers[index] = 0;
	}

	ClearPvTable();
	GameBoard.ply = 0;
	SearchController.nodes = 0;
	SearchController.fh = 0;
	SearchController.fhf = 0;
	SearchController.start = $.now();
	SearchController.stop = BOOL.FALSE;
}

function SearchPosition() {

	var bestMove = NOMOVE;
	var bestScore = -INFINITE;
	var Score = -INFINITE;
	var currentDepth = 0;
	var line; // set to string to print information to the console
	var PvNum;
	var c;
	ClearForSearch();
	// iterative deepening
	for (currentDepth = 1; currentDepth <= SearchController.depth; ++currentDepth) {

		Score = AlphaBeta(-INFINITE, INFINITE, currentDepth);


		if (SearchController.stop == BOOL.TRUE) {
			break;
		}

		bestScore = Score;
		bestMove = ProbePvTable();
		line = 'Depth:' + currentDepth + ' Best:' + PrMove(bestMove) + ' Score:' + bestScore +
			' nodes:' + SearchController.nodes;
		// score (above) is in centipawns (1/100) of pawn
		// nodes (above) is number of positions searched	


		PvNum = GetPvLine(currentDepth);
		line += ' Pv:';
		for (c = 0; c < PvNum; ++c) {
			line += ' ' + PrMove(GameBoard.PvArray[c]);
		}
		if (currentDepth != 1) {
			line += (" Ordering:" + ((SearchController.fhf / SearchController.fh) * 100).toFixed(2) + "%");
		}
		console.log(line);


	}

	SearchController.best = bestMove;
	SearchController.thinking = BOOL.FALSE;
	UpdateDOMStats(bestScore, currentDepth);
}

function UpdateDOMStats(dom_score, dom_depth) {

	var scoreText = "Score: " + (dom_score / 100).toFixed(2);
	if (Math.abs(dom_score) > MATE - MAXDEPTH) {
		scoreText = "Score: Mate In " + (MATE - (Math.abs(dom_score)) - 1) + " moves";
	}
feverOutput = PrMove(SearchController.best);
	$("#OrderingOut").text("Ordering: " + ((SearchController.fhf / SearchController.fh) * 100).toFixed(2) + "%");
	$("#DepthOut").text("Depth: " + dom_depth);
	$("#ScoreOut").text(scoreText);
	$("#NodesOut").text("Nodes: " + SearchController.nodes);
	$("#TimeOut").text("Time: " + (($.now() - SearchController.start) / 1000).toFixed(1) + "s");
	$("#BestOut").text("BestMove: " + PrMove(SearchController.best));
}

// console.log(feverOutput);