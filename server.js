var express = require("express");
var bodyParser = require("body-parser");
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var path = require("path");
var userArray = [];


var port = process.env.PORT || 3000;

var app = express();

var db = require("./models");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, "./public")));

app.use(expressSession({
    secret: 'secret code',
    //If saveUnitialized is set to true it will save a session to our session storage even if it is not initialized 
    saveUninitialized: false,
    //If resave is set to true it will save our session after each request
    //false will only save if we change something
    resave: false
}));



// Import routes and give the server access to them.
// require("./routes/api-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);





db.sequelize.sync({
    force: false
}).then(function () {
    app.listen(port, function () {
        console.log("App listening on port " + port);
    });
});