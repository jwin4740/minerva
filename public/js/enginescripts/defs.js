var PIECES = {
  EMPTY: 0,
  wP: 1,
  wN: 2,
  wB: 3,
  wR: 4,
  wQ: 5,
  wK: 6,
  bP: 7,
  bN: 8,
  bB: 9,
  bR: 10,
  bQ: 11,
  bK: 12
};

var BRD_SQ_NUM = 120;

var FILES = {
  FILE_A: 0,
  FILE_B: 1,
  FILE_C: 2,
  FILE_D: 3,
  FILE_E: 4,
  FILE_F: 5,
  FILE_G: 6,
  FILE_H: 7,
  FILE_NONE: 8
};

var RANKS = {
  RANK_1: 0,
  RANK_2: 1,
  RANK_3: 2,
  RANK_4: 3,
  RANK_5: 4,
  RANK_6: 5,
  RANK_7: 6,
  RANK_8: 7,
  RANK_NONE: 8
};

var COLOURS = {
  WHITE: 0,
  BLACK: 1,
  BOTH: 2
};

var CASTLEBIT = {
  WKCA: 1,
  WQCA: 2,
  BKCA: 4,
  BQCA: 8
};

var SQUARES = {
  A1: 21,
  B1: 22,
  C1: 23,
  D1: 24,
  E1: 25,
  F1: 26,
  G1: 27,
  H1: 28,
  A8: 91,
  B8: 92,
  C8: 93,
  D8: 94,
  E8: 95,
  F8: 96,
  G8: 97,
  H8: 98,
  NO_SQ: 99,
  OFFBOARD: 100
};

var BOOL = {
  FALSE: 0,
  TRUE: 1
};

var MAXGAMEMOVES = 2048; // safe number because most moves ever recorded in a game is like 500
var MAXPOSITIONMOVES = 256; // well beyond the number of posible move from a given position
var MAXDEPTH = 64;
var INFINITE = 30000;
var MATE = 29000;
var PVENTRIES = 10000;

var FilesBrd = new Array(BRD_SQ_NUM);
var RanksBrd = new Array(BRD_SQ_NUM);

var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

var PceChar = ".PNBRQKpnbrqk";
var SideChar = "wb-";
var RankChar = "12345678";
var FileChar = "abcdefgh";

// function that takes in a given file and rank, and returns the square coordinate
function FR2SQ(f, r) {
  return ((21 + (f)) + ((r) * 10));
}

var PieceBig = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
var PieceMaj = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE];
var PieceMin = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
var PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000];
var PieceCol = [COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
  COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK
];

var PiecePawn = [BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
var PieceKnight = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE];
var PieceKing = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE];
var PieceRookQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];
var PieceBishopQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE];
var PieceSlides = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE];



// directions or movements a particular piece can go with respect to the Array120 system
var KnDir = [-8, -19, -21, -12, 8, 19, 21, 12];
var RkDir = [-1, -10, 1, 10];
var BiDir = [-9, -11, 11, 9];
var KiDir = [-1, -10, 1, 10, -9, -11, 11, 9];

// direction numbers indexed by our piece type
// first two zeros are for pawns


var DirNum = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8];
var PceDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir];


var LoopNonSlidePce = [PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0];

// indexed by side: white starts at index 0; black at index 3
var LoopNonSlideIndex = [0, 3];

/* EXAMPLE for nonsliding pieces

while (pce != 0)
{
pceIndex = LoopNonSlideIndex[WHITE]  //which is 0
pce = LoopNonSlidePiece[pceIndex]    // pce gets 0 which is wN
pceIndex++;
loop pceDir [wN][0 - 8]
}


*/

var LoopSlidePce = [PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0];
var LoopSlideIndex = [0, 4];

var PieceKeys = new Array(14 * 120);
var SideKey;
var CastleKeys = new Array(16);

var Sq120ToSq64 = new Array(BRD_SQ_NUM); // these two functions show where a certain square is on
var Sq64ToSq120 = new Array(64); // both a 64 number array and a 120 board array


//    JAVASCRIPT BITWISE OPERATORS
//    |: OR      &: AND      ~: NOT     ^: EXCLUSIVE OR
//    <<: LEFT SHIFT         >>:  RIGHT SHIFT



// technically RAND_31; is a function that generates a random number with good coverage of all the bits ?? what does this mean ??
function RAND_32() {

  return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16) |
    (Math.floor((Math.random() * 255) + 1) << 8) | Math.floor((Math.random() * 255) + 1);

}

// for the evaluate functions it 'flips' the board to blacks perspective
var Mirror64 = [
  56, 57, 58, 59, 60, 61, 62, 63,
  48, 49, 50, 51, 52, 53, 54, 55,
  40, 41, 42, 43, 44, 45, 46, 47,
  32, 33, 34, 35, 36, 37, 38, 39,
  24, 25, 26, 27, 28, 29, 30, 31,
  16, 17, 18, 19, 20, 21, 22, 23,
  8, 9, 10, 11, 12, 13, 14, 15,
  0, 1, 2, 3, 4, 5, 6, 7
];

function SQ64(sq120) { // function that returns a 64 based number when given a 120 based number
  return Sq120ToSq64[(sq120)];
}

function SQ120(sq64) { // function that returns a 120 based number when given a 64 based number
  return Sq64ToSq120[(sq64)];
}

function PCEINDEX(pce, pceNum) {
  return (pce * 10 + pceNum);
}

// takes in a square and returns mirror64 array at the index of square 
function MIRROR64(sq) {
  return Mirror64[sq];
}

var Kings = [PIECES.wK, PIECES.bK];
var CastlePerm = [
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 7, 15, 15, 15, 3, 15, 15, 11, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
  15, 15, 15, 15, 15, 15, 15, 15, 15, 15
];

/* 
CastlePerm array is all 15s except the six squares are the locations
of a8 h8 a1 h1 e1 and e8
15 is binary 1111

essentially each move we have to check if each side is capable of castling
so if either king or rook is moved the castle permission must be adjusted to 
reflect that

- 1111 means both sides can still castle
    - fourth bit : white kingside
    - third bit : white queenside

example: if white king moves we bitwise AND 
cp &= CastlePerm[From]  1111 &= 1100 = 1100     15 &= 12 = 12    is our new castle permission

*/





/* MOVE GENERATION EXPANATION

from square
to square

enpassant capture
captured piece
promoted piece
pawn starting move
castling

instead of making a move move object i.e. 

var move = {
  from :  sq,
  to: sq,
  castle : ....
};

we are going to set it up with just one integer and align each bit of information
accordingly since we have 31 bits available

hex:      F    C    7
binary:  1111 1100 0111

squares available 21 -> 98

thus we can cover all of our moves within 7 bits -> 000 0000

example: if the move is stored in 28 bits, the first seven bits are for from square

*** bitwise AND(&) returns 1 if both bits are 1
*** bitwise OR(|) return 1 if either bit is 1
*** bitwise XOR(^) returns 1 if the bits are different

0000 0000 0000 0000 0000 0111 1111 -> From 0x7f

sample move:
0010 1100 0000 1111 0000 0111 1111 -> var d 
fromSq = d & 0x7f       

So for our different move possibilities
0000 0000 0000 0000 0000 0111 1111 -> From & 0x7f
0000 0000 0000 0011 1111 1000 0000 -> To >> 7, & 0x7f
0000 0000 0011 1100 0000 0000 0000 -> Captured >> 14, 0xf
0000 0000 0100 0000 0000 0000 0000 -> en passant & 0x40000 
0000 0000 1000 0000 0000 0000 0000 -> pawn start & 0x80000
0000 1111 0000 0000 0000 0000 0000 -> promoted piece >> 20, & 0xf
0001 0000 0000 0000 0000 0000 0000 -> castling & 0x100000
*/

// function MOVE(from, to, captured, promoted, flag){ 
//   return (from | (to << 7) | (captured << 14) | (promoted << 20) | flag);
// }

function FROMSQ(m) {
  return (m & 0x7F);
} // move From square
function TOSQ(m) {
  return ((m >> 7) & 0x7F);
} // move To square
function CAPTURED(m) {
  return ((m >> 14) & 0xF);
} // move capture
function PROMOTED(m) {
  return ((m >> 20) & 0xF);
} // move promotion

var MFLAGEP = 0x40000; // move flag en passant
var MFLAGPS = 0x80000; // move flag pawn start
var MFLAGCA = 0x1000000; // move flag castling

var MFLAGCAP = 0x7C000; // move flag "is the move a capture move"
var MFLAGPROM = 0xF00000; // move flag a promotion

var NOMOVE = 0;

function SQOFFBOARD(sq) {
  if (FilesBrd[sq] == SQUARES.OFFBOARD) return BOOL.TRUE;
  return BOOL.FALSE;
}

//--------------------------------------------------------------

// takes our piece and hashes it out
function HASH_PCE(pce, sq) {
  GameBoard.posKey ^= PieceKeys[(pce * 120) + sq];
}

// hashes the castling position
function HASH_CA() {
  GameBoard.posKey ^= CastleKeys[GameBoard.castlePerm];
}

// hashes the side position
function HASH_SIDE() {
  GameBoard.posKey ^= SideKey;
}

// hashes the en passant key
// we won't have a clash with any of the piece types because we are
// essentially saying pieceepmpty for en pas square
function HASH_EP() {
  GameBoard.posKey ^= PieceKeys[GameBoard.enPas];
}
//--------------------------------------------------------------------
var GameController = {};
GameController.EngineSide = COLOURS.BOTH;
GameController.PlayerSide = COLOURS.BOTH;
GameController.GameOver = BOOL.FALSE;

var UserMove = {};
UserMove.from = SQUARES.NO_SQ;
UserMove.to = SQUARES.NO_SQ;