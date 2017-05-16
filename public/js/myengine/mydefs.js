var engineSource;
var engineTarget;
var roundedScore;
var game = new Chess();
var move;
var board;
var gameStart = false;
var tempScoreArray = [];
var tempMaterialArray = [];
var GameScore = {};
var positionCount = 0;
GameScore.blackMaterial = 0;
GameScore.whiteMaterial = 0;
GameScore.startingScore = 0;
GameScore.currentScore = 0;
GameScore.searchScore = 0;
GameScore.captureScore = 0;
GameScore.mvvLvaScores = []; // every combination of victim and attacker will have their individual index


//         /*       A       B        C        D        E        F        G      H             */
//         const blankTable = [
// /*8*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
// /*7*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
// /*6*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
// /*5*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
// /*4*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
// /*3*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
// /*2*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
// /*1*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0
//         ];


const pieceObject = {
    empty: 0,
    wP: {
        index: 1,
        value: 100
    },
    wN: {
        index: 2,
        value: 300
    },
    wB: {
        index: 3,
        value: 300
    },
    wR: {
        index: 4,
        value: 500
    },
    wQ: {
        index: 5,
        value: 900
    },
    wK: {
        index: 6,
        value: 1
    },
    bP: {
        index: 7,
        value: 100
    },
    bN: {
        index: 8,
        value: 300
    },
    bB: {
        index: 9,
        value: 300
    },
    bR: {
        index: 10,
        value: 500
    },
    bQ: {
        index: 11,
        value: 900
    },
    bK: {
        index: 12,
        value: 1
    }
};


/*       A        B       C       D       E       F       G      H                  */
        const whitePawnTable = [
/*8*/    0   ,    0   ,   0    ,  0    ,  0    ,  0   ,   0   ,  0   ,     
/*7*/    20  ,    20  ,   20   ,  30   ,  30   ,  20  ,   20  ,  20  ,
/*6*/    10  ,    10  ,   10   ,  20   ,  20   ,  10  ,   10  ,  10  ,
/*5*/    5   ,    5   ,   5    ,  10   ,  10   ,  5   ,   5   ,  5   ,
/*4*/    0   ,    0   ,   10   ,  20   ,  20   ,  10  ,   0   ,  0   ,
/*3*/    5   ,    0   ,   0    ,  5    ,  5    ,  0   ,   0   ,  5   ,
/*2*/    10  ,    10  ,   0    , -10   , -10   ,  0   ,   10  ,  10  ,
/*1*/    0   ,    0   ,   0    ,  0    ,  0    ,  0   ,   0   ,  0
        ];


/*       A        B       C       D       E        F       G       H            */
        const whiteKnightTable = [
/*8*/    0   ,    0   ,   0   ,   0    ,  0    ,   0    ,   0    ,  0   ,
/*7*/    0   ,    0   ,   5   ,   10   ,  10   ,   5    ,   0    ,  0   ,
/*6*/    5   ,    10  ,   10  ,   20   ,  20   ,   10   ,   10   ,  5   ,
/*5*/    5   ,    10  ,   15  ,   20   ,  20   ,   15   ,   10   ,  5   ,
/*4*/    0   ,    5   ,   10  ,   20   ,  20   ,   10   ,   0    ,  0   ,
/*3*/    0   ,    0   ,   10  ,   10   ,  10   ,   10   ,   0    ,  0   ,
/*2*/    0   ,    0   ,   0   ,   5    ,  5    ,   0    ,   0    ,  0   ,
/*1*/    0   ,   -10  ,   0   ,   0    ,  0    ,   0    ,  -10   ,  0
        ];


/*       A        B        C       D        E        F       G      H            */
        const blackPawnTable = [
/*8*/    0   ,    0    ,   0   ,   0    ,   0    ,   0   ,   0   ,  0   ,
/*7*/   10   ,    10   ,   0   ,  -10   ,  -10   ,   0   ,   10  ,  10  ,
/*6*/    5   ,    0    ,   0   ,   5    ,   5    ,   0   ,   0   ,  5   ,
/*5*/    0   ,    0    ,   10  ,   20   ,   20   ,   10  ,   0   ,  0   ,
/*4*/    5   ,    5    ,   5   ,   10   ,   10   ,   5   ,   5   ,  5   ,
/*3*/   10   ,    10   ,   10  ,   20   ,   20   ,   10  ,   10  ,  10  ,
/*2*/   20   ,    20   ,   20  ,   30   ,   30   ,   20  ,   20  ,  20  ,
/*1*/    0   ,    0    ,   0   ,   0    ,   0    ,   0   ,   0   ,  0
        ];

/*       A       B        C        D        E        F        G      H             */
        const blackKnightTable = [
/*8*/    0   ,  -10   ,   0    ,   0    ,   0    ,   0    ,  -10  ,  0    ,
/*7*/    0   ,   0    ,   0    ,   5    ,   5    ,   0    ,   0   ,  0    ,
/*6*/    0   ,   0    ,   10   ,   10   ,   10   ,   10   ,   0   ,  0    ,
/*5*/    0   ,   0    ,   10   ,   20   ,   20   ,   10   ,   5   ,  0    ,
/*4*/    5   ,   10    ,  15   ,   20   ,   20   ,   15   ,   10   , 5    ,
/*3*/    5   ,   10   ,   10   ,   20   ,   20   ,   10   ,   10  ,  5    ,
/*2*/    0   ,   0    ,   5    ,   10   ,   10   ,   5    ,   0   ,  0    ,
/*1*/    0   ,   0    ,   0    ,   0    ,   0    ,   0    ,   0   ,  0
        ];


/*       A       B        C        D        E        F        G      H             */
        const blackQueenTable = [
/*8*/    0   ,   0    ,   0    ,   100  ,   0    ,   0    ,   0  ,  0    ,
/*7*/    0   ,   0    ,   0    ,   0    ,   0    ,   0    ,   0  ,  0    ,
/*6*/    0   ,   0    ,   0    ,   0    ,   0    ,   0    ,   0  ,  0    ,
/*5*/    0   ,   0    ,   0    ,   0    ,   0    ,   0    ,   0  ,  0    ,
/*4*/    0   ,   0    ,   0    ,   0    ,   0    ,   0    ,   0  ,  0    ,
/*3*/    0   ,   0    ,   0    ,   0    ,   0    ,   0    ,   0  ,  0    ,
/*2*/    0   ,   0    ,   0    ,   0    ,   0    ,   0    ,   0  ,  0    ,
/*1*/    0   ,   0    ,   0    ,   0    ,   0    ,   0    ,   0  ,  0
        ];

        /*       A       B        C        D        E        F        G      H             */
        const whiteQueenTable = [
/*8*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*7*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*6*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*5*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*4*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*3*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*2*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*1*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0
        ];

                /*       A       B        C        D        E        F        G      H             */
        const blackKingTable = [
/*8*/    0   ,   0    ,   0   ,   0    ,   0    ,  -200  ,   200 ,  0    ,
/*7*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*6*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*5*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*4*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*3*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*2*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0    ,
/*1*/    0   ,   0    ,   0   ,   0    ,   0    ,   0    ,   0   ,  0
        ];
        


