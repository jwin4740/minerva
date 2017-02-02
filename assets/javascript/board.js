var gameBoard = {};

gameBoard.pieces = (boardSquareNumber);
gameBoard.side = colors.white;
gameBoard.fiftyMove = 0;
gameBoard.hisPly = 0;
gameBoard.ply = 0;


// binary   decimal
// 0001   =    1              white kingside castling
// 0010   =    2              white queenside castling
// 0100   =    4              black kingside castling
// 1000   =    8              black queenside castling

// example 
// 1101   =    13       can do anything but white queenside castling

gameBoard.castlePermissions = 0;
gameBoard.material = [2]; // WHITE,BLACK material of pieces


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


console.log(gameBoard.material);
console.log(gameBoard);
