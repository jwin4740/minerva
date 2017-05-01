$(function() {
    init();
    // console.log("Main Init Called");

    // unique? 
    // Piece on Sq
    // side 
    // castle
    // enPas

    // posKey ^= RandNum for all pces on sq
    // posKey ^= RandNum for side 
    // posKey ^= castle	
    // posKey ^= enPas

    // example call
    var piece1 = RAND_32();
    var piece2 = RAND_32();
    var piece3 = RAND_32();
    var piece4 = RAND_32();
    // console.log(piece1);
    // console.log(piece2);
    // console.log(piece3);
    // console.log(piece4);

    var key = 0; // key represents a position with four pieces on it
    key ^= piece1;
    key ^= piece2;
    key ^= piece3;
    key ^= piece4;

    // console.log(key);

    // console.log("hex key: " + key.toString(16));

    // if piece one got captured the new key will be generated as follows

    key ^= piece1;
    // console.log("piece1 out key: " + key.toString(16));

    // the above is the exact same as this
    key = 0;
    key ^= piece2;
    key ^= piece3;
    key ^= piece4;
    // console.log("build no piece1 key: " + key.toString(16));

//-----------Even if pieces are out of order it returns same result
    var key = 0; // key represents a position with four pieces on it
    key ^= piece1;
    key ^= piece2;
    key ^= piece3;
    key ^= piece4;
    // console.log("hex key: " + key.toString(16));

    var key = 0; // key represents a position with four pieces on it
    key ^= piece2;
    key ^= piece4;
    key ^= piece1;
    key ^= piece3;
    // console.log("hex key: " + key.toString(16));
//-------------------------------------------------------------------------

    NewGame(START_FEN);
});

function InitFilesRanksBrd() {

    var index = 0;
    var file = FILES.FILE_A;
    var rank = RANKS.RANK_1;
    var sq = SQUARES.A1;

    for (index = 0; index < BRD_SQ_NUM; ++index) {
        FilesBrd[index] = SQUARES.OFFBOARD;
        RanksBrd[index] = SQUARES.OFFBOARD;
    }

    for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
        for (file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
            sq = FR2SQ(file, rank);
            FilesBrd[sq] = file;
            RanksBrd[sq] = rank;
        }
    }
}

function InitHashKeys() {
    var index = 0;

    for (index = 0; index < 14 * 120; ++index) {
        PieceKeys[index] = RAND_32();
    }

    SideKey = RAND_32();

    for (index = 0; index < 16; ++index) {
        CastleKeys[index] = RAND_32();
    }
}


// sets the Sq120ToSq64 internal array to the same values as Sq64ToSq120, and uses 65 as placeholders
// when the smaller array gets out of bounds

function InitSq120To64() {

    var index = 0;
    var file = FILES.FILE_A;
    var rank = RANKS.RANK_1;
    var sq = SQUARES.A1;
    var sq64 = 0;

    for (index = 0; index < BRD_SQ_NUM; ++index) {
        Sq120ToSq64[index] = 65;       // fills the empty array of 120 with all 65s
    }

    for (index = 0; index < 64; ++index) {
        Sq64ToSq120[index] = 120;      // fills the empty array of 64 with all 120s
    }

    for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; ++rank) {
        for (file = FILES.FILE_A; file <= FILES.FILE_H; ++file) {
            sq = FR2SQ(file, rank);
            Sq64ToSq120[sq64] = sq;
            Sq120ToSq64[sq] = sq64;
            sq64++;
        }
    }

}



function InitBoardVars() {

    // prepopulates the game.history array with maxgamemoves number of elements
    // fills it with dummy values

    var index = 0;
    for (index = 0; index < MAXGAMEMOVES; ++index) {
        GameBoard.history.push({
            move: NOMOVE,
            castlePerm: 0,
            enPas: 0,
            fiftyMove: 0,
            posKey: 0
        });
    }

// fills PvTable
    for (index = 0; index < PVENTRIES; ++index) {
        GameBoard.PvTable.push({
            move: NOMOVE,
            posKey: 0
        });
    }
}

function InitBoardSquares() {
    var light = 0;
    var rankName;
    var fileName;
    var divString;
    var lastLight = 0;
    var rankIter = 0;
    var fileIter = 0;
    var lightString;

    for (rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter--) {
        light = lastLight ^ 1;
        lastLight ^= 1;
        rankName = "rank" + (rankIter + 1);
        for (fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; fileIter++) {
            fileName = "file" + (fileIter + 1);

            if (light == 0) lightString = "Light";
            else lightString = "Dark";
            divString = "<div class=\"Square " + rankName + " " + fileName + " " + lightString + "\"/>";
            light ^= 1;
            $("#Board").append(divString);
        }
    }
}

function InitBoardSquares() {
    var light = 1;
    var rankName;
    var fileName;
    var divString;
    var rankIter;
    var fileIter;
    var lightString;

    for (rankIter = RANKS.RANK_8; rankIter >= RANKS.RANK_1; rankIter--) {
        light ^= 1;
        rankName = "rank" + (rankIter + 1);
        for (fileIter = FILES.FILE_A; fileIter <= FILES.FILE_H; fileIter++) {
            fileName = "file" + (fileIter + 1);
            if (light == 0) lightString = "Light";
            else lightString = "Dark";
            light ^= 1;
            divString = "<div class=\"Square " + rankName + " " + fileName + " " + lightString + "\"/>";
            $("#Board").append(divString);
        }
    }

}

function init() {
    // console.log("init() called");
    InitFilesRanksBrd();
    InitHashKeys();
    InitSq120To64();
    InitBoardVars();
    InitMvvLva();
    InitBoardSquares();
    CheckBoard();
   

}
