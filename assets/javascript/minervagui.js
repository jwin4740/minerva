var count = 0;


for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
        count++;
        if (count % 9 === 0) {
            count++;
        }
        if (count % 2 === 0) {
            $("#boardContainer").append("<div class='darkSquare'></div>");

        } else {
            $("#boardContainer").append("<div class='lightSquare'></div>");

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
