// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");
var path = require("path");
var sessions = require("express-session");

var moment = require('moment');
var passhash = require('password-hash-and-salt');
var security;
var userArray = [];
var session;



var gameObject = {
  gameCreated: false,
  gameID: "",
  gameStarted: false,
  whitePlayerData: {
    whitePlayerID: "x",
    whitePlayerRating: "x"
  },
  blackPlayerData: {
    blackPlayerID: "x",
    blackPlayerRating: "x"
  }

};






// Routes
// =============================================================
module.exports = function (app) {
  // function GameConstruct(startGame, playerOne, playerTwo, whiteMove, blackMove) {
  //   this.startGame = startGame;
  //   this.playerOne = playerOne;
  //   this.playerTwo = playerTwo;
  //   this.whiteMove = whiteMove;
  //   this.blackMove = blackMove;
  // }



  //  db.gamesetup.destroy({ 
  //   where: {
  //     starter: 'active'
  //   },
  //   truncate: true 
  // });


  // posts username/email object to the route
  app.post("/api/users", function (req, res) {
    db.User.findAll({})
      .then(function (data) {
        var n = data.length;
        console.log(data);
        for (var i = 0; i < n; i++) {
          var newUser = new UserConstruct(data[i].dataValues.username, data[i].dataValues.email);
          userArray.push(newUser);

        }
        console.log(userArray);
        res.json(userArray);
      });
  });

  app.get("/api/users", function (req, res) {
    res.json(userArray);

  });
  //REGISTER NEW USER
  app.post("/users", function (req, res, next) {
    //Validation - checks if form is filled out properly
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('passwordConfirm', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) { //if errors restart register page
      console.log(errors);
      req.session.success = false;
      res.redirect("/usererror");
    } else {
      //   //else look if there is a current user with same username or same email address

      db.User.findAll({
        where: {
          $or: [{
              username: req.body.username
            },
            {
              email: req.body.email
            }
          ]
        }
      }).then(function (userResults) {
        if (userResults.length) { //if there is a match of same name, restart register page
          res.redirect('/usererror');
        } else {
          //else hash password and create the user
          req.session.loggedIn = true;


          req.session.success = true;
          passhash(req.body.password).hash(function (error, hash) {
            if (error)
              throw new Error('Something went wrong!');

            // Store hash (incl. algorithm, iterations, and salt) 
            console.log(hash);
            security = hash;



            var created = moment().format('MMMM Do YYYY, h:mm:ss a');
            db.User.create({
              email: req.body.email,
              username: req.body.username,
              rating: 1000,
              security: security,
              account_created: created
            }).then(function (result) {
              // redirect to user.html with username in welcome message
              result
              req.session.newRegister = true;
              res.redirect('/');
            });
          });
        }
      });

    }
  });

  //SESSION LOGIN
  app.post("/login", function (req, res) {
    var session = req.session;
    var email = req.body.logEmail;
    var password = req.body.logPassword;

    var parsedKey = '';
    var userName = '';
    var userEmail = '';
    var userRating = '';
    session.newRegister = false;
    //checks hash against hash for entry validation
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function (user) {
      if (user == null) {
        return;
      }
      userEmail = user.email;
      userName = user.username;
      parsedKey = user.security;
      userRating = user.rating;
      verifyPassword();
    });


    // Verifying a hash 
    function verifyPassword() {
      passhash(password).verifyAgainst(parsedKey, function (error, verified) {
        if (error) {

          console.log(error);
        }
        if (!verified) {
          console.log("Don't try! We got you!");
        } else {
          session.loggedIn = true;

          session.uniqueID = [userEmail, userName, userRating];

          res.redirect('/multiplayer');
          console.log("you have successfully logged in");
        }
      });
    }
  });


  app.get("/loggedIn", function (req, res) {
    res.json(req.session);
  });
  var created;
  app.post("/gameCreated", function (req, res) {
    gameObject = req.body;

    console.log(gameObject.gameCreated);

    res.json(gameObject);
  });


  app.get("/gameCreated", function (req, res) {

    res.json(gameObject);
  });

};