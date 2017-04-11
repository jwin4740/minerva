const pieces = {EMPTY : 0, wP : 1, wN : 2, wB : 3, wR : 4, wQ : 5, wK : 6,   
bP : 7, bN : 8, bB : 9, bR : 10, bQ : 11, bK : 12};
// defines PIECES object for white and black PIECES


const boardSquareNumber = 120;

const files =  { file_A:0, file_B:1, file_C:2, file_D:3, 
	file_E:4, file_F:5, file_G:6, file_H:7, file_NONE:8 };
	
const ranks =  { rank_1:0, rank_2:1, rank_3:2, rank_4:3, 
	rank_5:4, rank_6:5, rank_7:6, rank_8:7, rank_NONE:8 };
	
const colors = { white : 0, black : 1, both : 2 };

const castleBit = {wKingside : 1, wQueenside : 2, bKingside : 4, bQueenside : 8}
const squares = {
  A1:21, B1:22, C1:23, D1:24, E1:25, F1:26, G1:27, H1:28,  
  A8:91, B8:92, C8:93, D8:94, E8:95, F8:96, G8:97, H8:98, 
  NO_SQ:99, OFFBOARD:100
};

var bool = { false : 0, true : 1 };

var filesBoard = [boardSquareNumber];
var ranksBoard = [boardSquareNumber];

// function that takes in a given file and rank, and returns the square coordinate
function getCoordinateFromFileRank (file, rank){
	return ( (21 + file) + (rank * 10) );
}

var pieceBig = [ bool.false, bool.false, bool.true, bool.true, bool.true, bool.true, bool.true, bool.false, bool.true, bool.true, bool.true, bool.true, bool.true ];
var pieceMaj = [ bool.false, bool.false, bool.false, bool.false, bool.true, bool.true, bool.true, bool.false, bool.false, bool.false, bool.true, bool.true, bool.true ];
var pieceMin = [ bool.false, bool.false, bool.true, bool.true, bool.false, bool.false, bool.false, bool.false, bool.true, bool.true, bool.false, bool.false, bool.false ];
var pieceVal= [ 0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000  ];
var pieceCol = [ colors.both, colors.white, colors.white, colors.white, colors.white, colors.white, colors.white,
	colors.black, colors.black, colors.black, colors.black, colors.black, colors.black ];
	
var piecePawn = [ bool.false, bool.true, bool.false, bool.false, bool.false, bool.false, bool.false, bool.true, bool.false, bool.false, bool.false, bool.false, bool.false ];	
var pieceKnight = [ bool.false, bool.false, bool.true, bool.false, bool.false, bool.false, bool.false, bool.false, bool.true, bool.false, bool.false, bool.false, bool.false ];
var pieceKing = [ bool.false, bool.false, bool.false, bool.false, bool.false, bool.false, bool.true, bool.false, bool.false, bool.false, bool.false, bool.false, bool.true ];
var pieceRookQueen = [ bool.false, bool.false, bool.false, bool.false, bool.true, bool.true, bool.false, bool.false, bool.false, bool.false, bool.true, bool.true, bool.false ];
var pieceBishopQueen = [ bool.false, bool.false, bool.false, bool.true, bool.false, bool.true, bool.false, bool.false, bool.false, bool.true, bool.false, bool.true, bool.false ];
var pieceSlides = [ bool.false, bool.false, bool.false, bool.true, bool.true, bool.true, bool.false, bool.false, bool.false, bool.true, bool.true, bool.true, bool.false ];
