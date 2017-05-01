// FEN notation for the starting positon


// ranks      8   /  7    /6/5/4/3/    2   /    1      turn   castling  enpassant   50 move count    fullmoves
//       rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR     w     KQkq         -        0                   1
var posKeyArray = [];

function PCEINDEX(pce, pceNum) {
	return (pce * 10 + pceNum);
}

var GameBoard = {};

GameBoard.pieces = new Array(BRD_SQ_NUM);
GameBoard.side = COLOURS.WHITE;
GameBoard.fiftyMove = 0;
GameBoard.hisPly = 0; // tells how many half moves we made for the entire game
GameBoard.history = [];
GameBoard.ply = 0; // set to 0 every move and will show how many half moves into the search tree we are
GameBoard.enPas = 0; // en passant square is set if there is a possibility for an en passant
GameBoard.castlePerm = 0;
GameBoard.material = new Array(2); // WHITE,BLACK material of pieces
GameBoard.pceNum = new Array(13); // indexed by Pce // an array for the each piece number ex: wP is 1   wN is 2
GameBoard.pList = new Array(14 * 10);
GameBoard.posKey = 0;
GameBoard.moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES);
GameBoard.moveListStart = new Array(MAXDEPTH);
GameBoard.PvTable = [];
GameBoard.PvArray = new Array(MAXDEPTH); // shows the best line the engine found or is finding during the search
GameBoard.searchHistory = new Array(14 * BRD_SQ_NUM); // indexed by piece and board square number
GameBoard.searchKillers = new Array(3 * MAXDEPTH);

/*
pce * 10 + pceNum

pceNum[bP] = 4;

for(num = 0 to 3) {
	bP * 10 + num;   70,71,72,73
	sq = pList[70]....
}

*/

// loop through the pieces and if the piece on a certain square and if it is your turn to move 
// then generate legal moves
/*

loop (pieces[])
if(piece on sq == Side tomove)
then genmoves() for piece on sq


sqOfpiece = PlistArray[index];

index?

wP * 10 + wPNum -> 0 based index of num of pieces(GameBoard.pceNum)
wN * 10 + wNnum

say we have 4 white pawns GameBoard.pceNum[wP] = 4

for(pceNum = 0; pceNum < GameBoard.pceNum[wP]; ++pceNum) {
	sq = PlistArray[wP * 10 + pceNum]

}

sq1 = PlistArray[wP * 10 + 0]
sq2 = PlistArray[wP * 10 + 1]
sq3 = PlistArray[wP * 10 + 2]
sq4 = PlistArray[wP * 10 + 3]

wP 10 -> 19
*/

// checks if the pieces exist in the GameBoard.pieces array where the piecelist says it does
// that the material is ok and that the position key is okay and the side is ok
function CheckBoard() {

	var t_pceNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // mirror the pceNum array
	var t_material = [0, 0]; // mirror the material array
	var sq64, t_piece, t_pce_num, sq120, colour, pcount;

	// loops through the piecelist	
	for (t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		for (t_pce_num = 0; t_pce_num < GameBoard.pceNum[t_piece]; ++t_pce_num) {
			sq120 = GameBoard.pList[PCEINDEX(t_piece, t_pce_num)];
			if (GameBoard.pieces[sq120] != t_piece) {
				// console.log('Error Pce Lists');
				return BOOL.FALSE;
			}
		}
	}

	for (sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64);
		t_piece = GameBoard.pieces[sq120];
		t_pceNum[t_piece]++;
		t_material[PieceCol[t_piece]] += PieceVal[t_piece];
	}

	for (t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		if (t_pceNum[t_piece] != GameBoard.pceNum[t_piece]) {
			// console.log('Error t_pceNum');
			return BOOL.FALSE;
		}
	}

	if (t_material[COLOURS.WHITE] != GameBoard.material[COLOURS.WHITE] ||
		t_material[COLOURS.BLACK] != GameBoard.material[COLOURS.BLACK]) {
		// console.log('Error t_material');
		return BOOL.FALSE;
	}

	if (GameBoard.side != COLOURS.WHITE && GameBoard.side != COLOURS.BLACK) {
		// console.log('Error GameBoard.side');
		return BOOL.FALSE;
	}

	if (GeneratePosKey() != GameBoard.posKey) {
		// console.log('Error GameBoard.posKey');
		return BOOL.FALSE;
	}
	return BOOL.TRUE;
}

function PrintBoard() {

	var sq, file, rank, piece;

	// console.log("\nGame Board:\n");
	for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		var line = (RankChar[rank] + "  ");
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file, rank);
			piece = GameBoard.pieces[sq];
			line += (" " + PceChar[piece] + " ");
		}
		// console.log(line);
	}


	var line = "   ";
	for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
		line += (' ' + FileChar[file] + ' ');
	}


	// console.log("side:" + SideChar[GameBoard.side]);
	// console.log("enPas:" + GameBoard.enPas);
	line = "";

	if (GameBoard.castlePerm & CASTLEBIT.WKCA) line += 'K';
	if (GameBoard.castlePerm & CASTLEBIT.WQCA) line += 'Q';
	if (GameBoard.castlePerm & CASTLEBIT.BKCA) line += 'k';
	if (GameBoard.castlePerm & CASTLEBIT.BQCA) line += 'q';

	// posKeyArray.push(GameBoard.posKey.toString(16));

	// console.log("castle: " + GameBoard.castlePerm);
}

// generates unique position key every time there is a move
function GeneratePosKey() {

	var sq = 0;
	var finalKey = 0;
	var piece = PIECES.EMPTY;

	for (sq = 0; sq < BRD_SQ_NUM; ++sq) {
		piece = GameBoard.pieces[sq];
		if (piece != PIECES.EMPTY && piece != SQUARES.OFFBOARD) {
			finalKey ^= PieceKeys[(piece * 120) + sq]; // exclusive or
		}
	}

	if (GameBoard.side == COLOURS.WHITE) {
		finalKey ^= SideKey;
	}

	if (GameBoard.enPas != SQUARES.NO_SQ) {
		finalKey ^= PieceKeys[GameBoard.enPas];
	}

	finalKey ^= CastleKeys[GameBoard.castlePerm];

	// console.log("key: " + finalKey);
	return finalKey;

}

function PrintPieceLists() {

	var piece, pceNum;
	// first for loop starts at the whitepawn (1) and ends at black king (12)
	for (piece = PIECES.wP; piece <= PIECES.bK; ++piece) {
		for (pceNum = 0; pceNum < GameBoard.pceNum[piece]; ++pceNum) {
			// console.log('Piece ' + PceChar[piece] + ' on ' + PrSq(GameBoard.pList[PCEINDEX(piece, pceNum)]));
		}
	}

}

function UpdateListsMaterial() {

	var piece, sq, index, colour;

	for (index = 0; index < 14 * 120; ++index) {
		GameBoard.pList[index] = PIECES.EMPTY;
	}

	for (index = 0; index < 2; ++index) {
		GameBoard.material[index] = 0;
	}

	for (index = 0; index < 13; ++index) {
		GameBoard.pceNum[index] = 0;
	}

	for (index = 0; index < 64; ++index) {
		sq = SQ120(index);
		piece = GameBoard.pieces[sq];
		if (piece != PIECES.EMPTY) {
			// console.warn("piece " + piece + " on " + sq);

			colour = PieceCol[piece];

			GameBoard.material[colour] += PieceVal[piece];

			GameBoard.pList[PCEINDEX(piece, GameBoard.pceNum[piece])] = sq;
			GameBoard.pceNum[piece]++;
		}
	}

}

function ResetBoard() {

	var index = 0;

	for (index = 0; index < BRD_SQ_NUM; ++index) {
		GameBoard.pieces[index] = SQUARES.OFFBOARD;
	}

	for (index = 0; index < 64; ++index) {
		GameBoard.pieces[SQ120(index)] = PIECES.EMPTY;
	}

	GameBoard.side = COLOURS.BOTH;
	GameBoard.enPas = SQUARES.NO_SQ;
	GameBoard.fiftyMove = 0;
	GameBoard.ply = 0;
	GameBoard.hisPly = 0;
	GameBoard.castlePerm = 0;
	GameBoard.posKey = 0;
	GameBoard.moveListStart[GameBoard.ply] = 0;

	/* HOW THE PIECE LIST WORKS
pce * 10 + pceNum

pceNum[bP] = 4;

for(num = 0 to 3) {
	bP * 10 + num;   70,71,72,73
	sq = pList[70]....
}

*/
}

//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

function ParseFen(fen) {

	ResetBoard();

	var rank = RANKS.RANK_8;
	var file = FILES.FILE_A;
	var piece = 0;
	var count = 0;
	var i = 0;
	var sq120 = 0;
	var fenCnt = 0; // fen[fenCnt]

	while ((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
		count = 1;
		switch (fen[fenCnt]) {
			case 'p':
				piece = PIECES.bP;
				break;
			case 'r':
				piece = PIECES.bR;
				break;
			case 'n':
				piece = PIECES.bN;
				break;
			case 'b':
				piece = PIECES.bB;
				break;
			case 'k':
				piece = PIECES.bK;
				break;
			case 'q':
				piece = PIECES.bQ;
				break;
			case 'P':
				piece = PIECES.wP;
				break;
			case 'R':
				piece = PIECES.wR;
				break;
			case 'N':
				piece = PIECES.wN;
				break;
			case 'B':
				piece = PIECES.wB;
				break;
			case 'K':
				piece = PIECES.wK;
				break;
			case 'Q':
				piece = PIECES.wQ;
				break;

			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
				piece = PIECES.EMPTY;
				count = fen[fenCnt].charCodeAt() - '0'.charCodeAt();
				break;

			case '/':
			case ' ':
				rank--; // rank starts at 8 then decrements
				file = FILES.FILE_A; // moves from file A to H so, it resets it to A
				fenCnt++; // index of fen
				continue;
			default:
				// console.log("FEN error");
				return;

		}

		for (i = 0; i < count; i++) {
			sq120 = FR2SQ(file, rank);
			GameBoard.pieces[sq120] = piece;
			file++;
		}
		fenCnt++;
	} // while loop end

	//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
	GameBoard.side = (fen[fenCnt] == 'w') ? COLOURS.WHITE : COLOURS.BLACK;
	fenCnt += 2;

	for (i = 0; i < 4; i++) {
		if (fen[fenCnt] == ' ') {
			break;
		}

		// castling permissions check	
		switch (fen[fenCnt]) {
			case 'K':
				GameBoard.castlePerm |= CASTLEBIT.WKCA;
				break;
			case 'Q':
				GameBoard.castlePerm |= CASTLEBIT.WQCA;
				break;
			case 'k':
				GameBoard.castlePerm |= CASTLEBIT.BKCA;
				break;
			case 'q':
				GameBoard.castlePerm |= CASTLEBIT.BQCA;
				break;
			default:
				break;
		}
		fenCnt++;
	}
	fenCnt++;

	if (fen[fenCnt] != '-') {
		file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt();
		rank = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt();
		// console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank);
		GameBoard.enPas = FR2SQ(file, rank);
	}
	// console.log(fen);
	GameBoard.posKey = GeneratePosKey();
	UpdateListsMaterial();
	PrintSqAttacked();
}

function PrintSqAttacked() {

	var sq, file, rank, piece;

	// console.log("\nAttacked:\n");

	for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		var line = ((rank + 1) + "  ");
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file, rank);
			if (SqAttacked(sq, GameBoard.side ^ 1) == BOOL.TRUE) piece = "X";
			else piece = "-";
			line += (" " + piece + " ");
		}
		// console.log(line);
	}



}

function SqAttacked(sq, side) {
	var pce;
	var t_sq;
	var index;

	// for pawn attacks
	if (side == COLOURS.WHITE) { // tells if a square occupied by a black piece is being attacked by a white pawn from the array[120] grid
		if (GameBoard.pieces[sq - 11] == PIECES.wP || GameBoard.pieces[sq - 9] == PIECES.wP) {
			return BOOL.TRUE;
		}
	} else { // tells if a square occupied by a black piece is being attacked by a white pawn from the array[120] grid
		if (GameBoard.pieces[sq + 11] == PIECES.bP || GameBoard.pieces[sq + 9] == PIECES.bP) {
			return BOOL.TRUE;
		}
	}


	// this is for the knight; 8 is the number of possible moves a knight can make if in the center of the board
	// KnDir[index] goes through the integers in the KnDir array sequentially; 
	// if the square is attacked it will return true
	for (index = 0; index < 8; index++) {
		pce = GameBoard.pieces[sq + KnDir[index]];
		if (pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKnight[pce] == BOOL.TRUE) {
			return BOOL.TRUE;
		}
	}


	// check if attacked square is in the path of queen or rook
	for (index = 0; index < 4; ++index) {
		dir = RkDir[index];
		t_sq = sq + dir;
		pce = GameBoard.pieces[t_sq];
		while (pce != SQUARES.OFFBOARD) {
			if (pce != PIECES.EMPTY) {
				if (PieceRookQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = GameBoard.pieces[t_sq];
		}
	}

	// check if attacked square is in the (diagonal) path of queen or bishop
	for (index = 0; index < 4; ++index) {
		dir = BiDir[index];
		t_sq = sq + dir;
		pce = GameBoard.pieces[t_sq];
		while (pce != SQUARES.OFFBOARD) {
			if (pce != PIECES.EMPTY) {
				if (PieceBishopQueen[pce] == BOOL.TRUE && PieceCol[pce] == side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = GameBoard.pieces[t_sq];
		}
	}


	// check if king is attacking square
	for (index = 0; index < 8; index++) {
		pce = GameBoard.pieces[sq + KiDir[index]];
		if (pce != SQUARES.OFFBOARD && PieceCol[pce] == side && PieceKing[pce] == BOOL.TRUE) {
			return BOOL.TRUE;
		}
	}

	return BOOL.FALSE;

}