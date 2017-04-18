// removes piece from board

function ClearPiece(sq) {

    var pce = GameBoard.pieces[sq]; // find which piece we are clearing      
    var col = PieceCol[pce];
    var index;
    var t_pceNum = -1; // represents temporary pceNum

    HASH_PCE(pce, sq); // removes our piece from the position key

    GameBoard.pieces[sq] = PIECES.EMPTY; // sets the square in question to empty
    GameBoard.material[col] -= PieceVal[pce];

    // removes our piece from the piece list

    /*
    sq = square3

    pList[wP 0] =square1
    pList[wP 1] =square2
    pList[wP 2] =square3   // if we are clearing the white pawn on square3, we set the t_pceNum
    pList[wP 3] =square4
    pList[wP 4] =square5

    t_pceNum = 2;
    swap value at 4 and 2;

    pList[wP 0] =square1
    pList[wP 1] =square2
    pList[wP 2] =square5   
    pList[wP 3] =square4
    pList[wP 4] =square3

    reduce pceNum for wP by 1 (so new list looks like: )
    pList[wP 0] =square1
    pList[wP 1] =square2
    pList[wP 2] =square5   
    pList[wP 3] =square4

    */
    for (index = 0; index < GameBoard.pceNum[pce]; ++index) {
        if (GameBoard.pList[PCEINDEX(pce, index)] == sq) {
            t_pceNum = index;
            break;
        }
    }

    GameBoard.pceNum[pce]--;
    GameBoard.pList[PCEINDEX(pce, t_pceNum)] = GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])];

}

function AddPiece(sq, pce) {

    var col = PieceCol[pce]; // get piece color

    HASH_PCE(pce, sq); // hash piece in and update position key

    GameBoard.pieces[sq] = pce;
    GameBoard.material[col] += PieceVal[pce];
    GameBoard.pList[PCEINDEX(pce, GameBoard.pceNum[pce])] = sq; // insert into piece list
    GameBoard.pceNum[pce]++;

}


// move piece from square to square
function MovePiece(from, to) {

    var index = 0;
    var pce = GameBoard.pieces[from]; // get piece we are moving

    HASH_PCE(pce, from); // hash piece out from the 'from square'
    GameBoard.pieces[from] = PIECES.EMPTY;

    HASH_PCE(pce, to); // hash piece back in to the 'to' square
    GameBoard.pieces[to] = pce;

    // loops through all of the pieces we have on the board
    // and finds where the 'from' is and sets it to 'to'
    for (index = 0; index < GameBoard.pceNum[pce]; ++index) {
        if (GameBoard.pList[PCEINDEX(pce, index)] == from) {
            GameBoard.pList[PCEINDEX(pce, index)] = to;
            break;
        }
    }

}

function MakeMove(move) {

    /* first need to account for taking back a move or undoing a move



    */

    var from = FROMSQ(move);
    var to = TOSQ(move);
    var side = GameBoard.side;

    // store new position key in history array
    GameBoard.history[GameBoard.hisPly].posKey = GameBoard.posKey;


    // if move bitwise ANDed with enpasant flag is not zero we know move was en passant
    if ((move & MFLAGEP) != 0) {
        if (side == COLOURS.WHITE) {
            ClearPiece(to - 10); // removes white piece from board
        } else {
            ClearPiece(to + 10); // removes black piece from board
        }
    }
    // deals with moving the rook for when the side is castling   
    else if ((move & MFLAGCA) != 0) {
        switch (to) {
            case SQUARES.C1:
                MovePiece(SQUARES.A1, SQUARES.D1);
                break;
            case SQUARES.C8:
                MovePiece(SQUARES.A8, SQUARES.D8);
                break;
            case SQUARES.G1:
                MovePiece(SQUARES.H1, SQUARES.F1);
                break;
            case SQUARES.G8:
                MovePiece(SQUARES.H8, SQUARES.F8);
                break;
            default:
                break;
        }
    }
    // hashes out the en passant square if player makes a pawn start move
    if (GameBoard.enPas != SQUARES.NO_SQ) HASH_EP();
    HASH_CA();


    // set up values of currently history ply index
    GameBoard.history[GameBoard.hisPly].move = move;
    GameBoard.history[GameBoard.hisPly].fiftyMove = GameBoard.fiftyMove;
    // en passant square hasn't yet been set to no_sq, we're just storing it
    GameBoard.history[GameBoard.hisPly].enPas = GameBoard.enPas;
    GameBoard.history[GameBoard.hisPly].castlePerm = GameBoard.castlePerm;

    // castle perm must be sit for to and from because the opponent may capture a rook
    // disabling castling ability
    GameBoard.castlePerm &= CastlePerm[from];
    GameBoard.castlePerm &= CastlePerm[to];
    GameBoard.enPas = SQUARES.NO_SQ;

    HASH_CA();

    var captured = CAPTURED(move);
    GameBoard.fiftyMove++; // increase 50 move array

    if (captured != PIECES.EMPTY) {
        ClearPiece(to);
        GameBoard.fiftyMove = 0;
    }

    GameBoard.hisPly++;
    GameBoard.ply++;

    if (PiecePawn[GameBoard.pieces[from]] == BOOL.TRUE) {
        GameBoard.fiftyMove = 0;
        if ((move & MFLAGPS) != 0) {
            if (side == COLOURS.WHITE) {
                GameBoard.enPas = from + 10;
            } else {
                GameBoard.enPas = from - 10;
            }
            HASH_EP(); //hashes eP square into hash key
        }
    }

// THIS IS WHERE WE FINALLY MOVE THE PIECE
    MovePiece(from, to);


// for promotion piece
    var prPce = PROMOTED(move);
    if (prPce != PIECES.EMPTY) {
        ClearPiece(to);
        AddPiece(to, prPce);
    }

    GameBoard.side ^= 1;  // switches side
    HASH_SIDE();


// sees if king is in check
    if (SqAttacked(GameBoard.pList[PCEINDEX(Kings[side], 0)], GameBoard.side)) {
        TakeMove();
        return BOOL.FALSE;
    }
  
    return BOOL.TRUE;



}

function TakeMove() {
//need to decrement by one to find the info on the previous move
    GameBoard.hisPly--;  
    GameBoard.ply--;

    var move = GameBoard.history[GameBoard.hisPly].move;
    var from = FROMSQ(move);
    var to = TOSQ(move);

    if (GameBoard.enPas != SQUARES.NO_SQ) HASH_EP();
    HASH_CA();

    GameBoard.castlePerm = GameBoard.history[GameBoard.hisPly].castlePerm;
    GameBoard.fiftyMove = GameBoard.history[GameBoard.hisPly].fiftyMove;
    GameBoard.enPas = GameBoard.history[GameBoard.hisPly].enPas;

    if (GameBoard.enPas != SQUARES.NO_SQ) HASH_EP();
    HASH_CA();

    GameBoard.side ^= 1;
    HASH_SIDE();


// add piece at en passant square
    if ((MFLAGEP & move) != 0) {
        if (GameBoard.side == COLOURS.WHITE) {
            AddPiece(to - 10, PIECES.bP);
        } else {
            AddPiece(to + 10, PIECES.wP);
        }
    } else if ((MFLAGCA & move) != 0) {
        switch (to) {
            case SQUARES.C1:
                MovePiece(SQUARES.D1, SQUARES.A1);
                break;
            case SQUARES.C8:
                MovePiece(SQUARES.D8, SQUARES.A8);
                break;
            case SQUARES.G1:
                MovePiece(SQUARES.F1, SQUARES.H1);
                break;
            case SQUARES.G8:
                MovePiece(SQUARES.F8, SQUARES.H8);
                break;
            default:
                break;
        }
    }

    MovePiece(to, from);

    var captured = CAPTURED(move);
    if (captured != PIECES.EMPTY) {
        AddPiece(to, captured);
    }

    if (PROMOTED(move) != PIECES.EMPTY) {
        ClearPiece(from);
        AddPiece(from, (PieceCol[PROMOTED(move)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP));
    }

}