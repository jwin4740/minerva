$(document).ready(function () {
    var userEmail;
    var userID;
    var rating;


    $.get("/loggedIn", function (data) {
        console.log(data);
        if (data.loggedIn) {

            sessionStorage.email = data.uniqueID[0];
            sessionStorage.userID = data.uniqueID[1];
            sessionStorage.rating = data.uniqueID[2];
            console.log(sessionStorage);
            $("body").append("<h1> You are in </h1>");

        }

    });

    $("#logoutButton").on("click", function () {
        sessionStorage.clear();
    });

});