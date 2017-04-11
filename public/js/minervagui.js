var modCount = 0;
var count = 1;


for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
        modCount++;
        if (modCount % 9 === 0) {
            modCount++;
        }
        if (modCount % 2 === 0) {
            $("#boardContainer").append("<div class='darkSquare " + count + "'></div>");
            count++;

        } else {
            $("#boardContainer").append("<div class='lightSquare " + count + "'></div>");
            count++;
        }

    }
}

for (var i = 8; i > 0; i--) {
    $("#rankLabelsContainer").append("<div class='labels'>" + i + "</div>");
}

for (var i = 0; i < 8; i++) {
    var letter = String.fromCharCode(i + 65);
    $("#fileLabelsContainer").append("<div class='labelsRow'>" + letter + "</div>");
}



$(".64").append("<img src='assets/images/wR.png'>");
$(".63").append("<img src='assets/images/wN.png'>");

