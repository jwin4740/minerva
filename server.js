var express = require("express");
var bodyParser = require("body-parser");
var expressValidator = require('express-validator');
var expressSession = require('express-session');
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
    saveUninitialized: false,
    //If resave is set to true it will save our session after each request
    //false will only save if we change something
    resave: false
}));



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
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);



// Import routes and give the server access to them.
// require("./routes/api-routes.js")(app);






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
        console.log(data);
        io.sockets.emit('new message', {
            msg: data
        });
    });

       socket.on('start game click', function (data) {
        console.log(data);
        io.sockets.emit('game started', {
            msg: data,
            whiteBoolServer : false
        });
    });

// ply move
    socket.on('move', function(msg) {
         console.log("movesocket");
        socket.broadcast.emit('move', msg);
        
        console.log(msg);
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