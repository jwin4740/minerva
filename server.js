var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var path = require("path");


var port = process.env.PORT || 3000;

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));
app.use(express.static(path.join(__dirname, "./public")));



// Import routes and give the server access to them.
// require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);



app.listen(port, function () {
    console.log("App listening on port " + port);
});