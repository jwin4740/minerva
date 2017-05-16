var express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var filter = require("swearjar");


var path = require("path");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var connections = [];


//Express Session
app.use(expressSession({
    secret: 'secret code',
    //If saveUnitialized is set to true it will save a session to our session storage even if it is not initialized 
    saveUninitialized: true,
    cookie: {
        maxAge: 6 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000
    },
    proxy: true,
    //If resave is set to true it will save our session after each request
    //false will only save if we change something
    resave: true

}));
app.use(cookieParser());

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
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);






io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //disconnect
    socket.on('disconnect', function (data) {
        // if (!socket.username) return;
        // users.splice(users.indexOf(socket.username), 1);
        // updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnect: %s sockets connected', connections.length);
    });

    // Send message

    socket.on('send message', function (data) {
        var filtered = filter.censor(data);
        console.log(filtered);
        socket.broadcast.emit('new message', filtered);
    });

    socket.on('players confirmed', function (data) {
        socket.broadcast.emit('players confirmed', data);
    });

    socket.on('white player click', function (data) {
        socket.broadcast.emit('white player click', data);
    });

    socket.on('black player click', function (data) {
        socket.broadcast.emit('black player click', data);
    });

    socket.on('game start', function (data) {
        // console.log(data);
        socket.broadcast.emit('game start', data);
    });

    socket.on('sync', function (data) {
        // console.log(data);
        socket.broadcast.emit('sync', data);
    });


    socket.on('game has started', function (data) {
        // console.log(data);
        socket.broadcast.emit('game has started', data);
    });

    // ply move
    socket.on('move', function (msg) {
        // console.log("movesocket");
        socket.broadcast.emit('moveresponse', msg);
        console.log(msg);
    });



    socket.on('sendCapture', function (captureObject) {

        socket.broadcast.emit('receiveCapture', captureObject);

    });




    // new user

    socket.on('new user', function (data, callback) {
        callback(true); // set callback to 'true'
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

});




db.sequelize.sync({
    force: false
}).then(function () {
    server.listen(port, function () {
        console.log('server listening on port: ' + port);
    });
});