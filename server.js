var express = require("express");
var bodyParser = require("body-parser");
var expressValidator = require('express-validator');
// var expressSession = require('express-session');
var path = require("path");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require("./models");


var port = process.env.PORT || 8080;




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
// app.use(expressSession({
//     secret: 'secret code',
//     //If saveUnitialized is set to true it will save a session to our session storage even if it is not initialized 
//     saveUninitialized: false,
//     //If resave is set to true it will save our session after each request
//     //false will only save if we change something
//     resave: false
// }));

require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

var lobbyUsers = {};
var users = {};
var activeGames = {};


io.on('connection', function (socket) {
    console.log('new connection ' + socket);

    socket.on('login', function (userId) {
        doLogin(socket, userId);
    });

    function doLogin(socket, userId) {
        socket.userId = userId;

        if (!users[userId]) {
            console.log('creating new user');
            users[userId] = {
                userId: socket.userId,
                games: {}
            };
        } else {
            console.log('user found!');
            Object.keys(users[userId].games).forEach(function (gameId) {
                console.log('gameid - ' + gameId);
            });
        }

        socket.emit('login', {
            users: Object.keys(lobbyUsers),
            games: Object.keys(users[userId].games)
        });
        lobbyUsers[userId] = socket;

        socket.broadcast.emit('joinlobby', socket.userId);
    }

    socket.on('invite', function (opponentId) {
        console.log('got an invite from: ' + socket.userId + ' --> ' + opponentId);

        socket.broadcast.emit('leavelobby', socket.userId);
        socket.broadcast.emit('leavelobby', opponentId);


        var game = {
            id: Math.floor((Math.random() * 100) + 1),
            board: null,
            users: {
                white: socket.userId,
                black: opponentId
            }
        };

        socket.gameId = game.id;
        activeGames[game.id] = game;

        users[game.users.white].games[game.id] = game.id;
        users[game.users.black].games[game.id] = game.id;

        console.log('starting game: ' + game.id);
        lobbyUsers[game.users.white].emit('joingame', {
            game: game,
            color: 'white'
        });
        lobbyUsers[game.users.black].emit('joingame', {
            game: game,
            color: 'black'
        });

        delete lobbyUsers[game.users.white];
        delete lobbyUsers[game.users.black];

        socket.broadcast.emit('gameadd', {
            gameId: game.id,
            gameState: game
        });
    });

    socket.on('resumegame', function (gameId) {
        console.log('ready to resume game: ' + gameId);

        socket.gameId = gameId;
        var game = activeGames[gameId];

        users[game.users.white].games[game.id] = game.id;
        users[game.users.black].games[game.id] = game.id;

        console.log('resuming game: ' + game.id);
        if (lobbyUsers[game.users.white]) {
            lobbyUsers[game.users.white].emit('joingame', {
                game: game,
                color: 'white'
            });
            delete lobbyUsers[game.users.white];
        }

        if (lobbyUsers[game.users.black]) {
            lobbyUsers[game.users.black] &&
                lobbyUsers[game.users.black].emit('joingame', {
                    game: game,
                    color: 'black'
                });
            delete lobbyUsers[game.users.black];
        }
    });

    socket.on('move', function (msg) {
        socket.broadcast.emit('move', msg);
        activeGames[msg.gameId].board = msg.board;
        console.log(msg);
    });

    socket.on('resign', function (msg) {
        console.log("resign: " + msg);

        delete users[activeGames[msg.gameId].users.white].games[msg.gameId];
        delete users[activeGames[msg.gameId].users.black].games[msg.gameId];
        delete activeGames[msg.gameId];

        socket.broadcast.emit('resign', msg);
    });


    socket.on('disconnect', function (msg) {

        console.log(msg);

        if (socket && socket.userId && socket.gameId) {
            console.log(socket.userId + ' disconnected');
            console.log(socket.gameId + ' disconnected');
        }

        delete lobbyUsers[socket.userId];

        socket.broadcast.emit('logout', {
            userId: socket.userId,
            gameId: socket.gameId
        });
    });

    /////////////////////
    // Dashboard messages 
    /////////////////////

    socket.on('dashboardlogin', function () {
        console.log('dashboard joined');
        socket.emit('dashboardlogin', {
            games: activeGames
        });
    });

});




db.sequelize.sync({
    force: false
}).then(function () {
    http.listen(port, function () {
        console.log('server listening on port: ' + port);
    });
});






