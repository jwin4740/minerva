$(function() {
    init();
    console.log("Main Init Called");

});

function init() {
    console.log("init() called");
    initFileRankBoard();
}


function initFileRankBoard() {

    var file = files.file_A;
    var rank = ranks.rank_1;
    var square = squares.A1;

    for (var i = 0; i < boardSquareNumber; i++) {
        filesBoard[i] = squares.OFFBOARD;
        ranksBoard[i] = squares.OFFBOARD;
    }

    for (rank = ranks.rank_1; rank <= ranks.rank_8; rank++) {
        for (file = files.file_A; file <= files.file_H; file++) {
            square = getCoordinateFromFileRank(file, rank);
            filesBoard[square] = file;
            ranksBoard[square] = rank;
        }

    }
    console.log(filesBoard[0] + ranksBoard[0]);
    console.log(filesBoard[squares.A1] + ranksBoard[squares.A1]);
    console.log(filesBoard[squares.E8] + ranksBoard[squares.E8]);
}
