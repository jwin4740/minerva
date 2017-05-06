
var child_3 = {
    value: 10
};
var child_4 = {
    value: -10
};

var child_7 = {
    value: 3
};

var child_5 = {
    value: 5
};

var child_6 = {
    value: -7
};



var child_1 = {
    children: [child_3, child_4, child_7]
};

var child_2 = {
    children: [child_5, child_6]
};

var parent = {
    nodeStructure: {
        text: {
            name: "parent node"
        },
        children: [child_1, child_2]
    }
};

function minimax(node, depth, max_player) {
    if (depth === 0 || !("children" in node)) {
        return node.value; // which is the leaf node with a gameScore
    }

    var bestValue, v;

    if (max_player) {
        bestValue = Number.NEGATIVE_INFINITY;

        for (var child in node.children) {
            v = minimax(node.children[child], depth - 1, false);
            bestValue = Math.max(v, bestValue);
        }
        return bestValue;
    } else {
        bestValue = Number.POSITIVE_INFINITY;

        for (var child in node.children) {
            v = minimax(node.children[child], depth - 1, true);
            bestValue = Math.min(v, bestValue);
        }
        return bestValue;
    }
}
startMinimax();
function startMinimax() {
    var data = minimax(parent.nodeStructure, 2, true);
    console.log(data);
}

/*
int maxi( int depth ) {
    if ( depth == 0 ) return evaluate();
    int max = -oo;
    for ( all moves) {
        score = mini( depth - 1 );
        if( score > max )
            max = score;
    }
    return max;
}
 
int mini( int depth ) {
    if ( depth == 0 ) return -evaluate();
    int min = +oo;
    for ( all moves) {
        score = maxi( depth - 1 );
        if( score < min )
            min = score;
    }
    return min;
} */