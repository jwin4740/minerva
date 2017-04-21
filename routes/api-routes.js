// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");
var path = require("path");
var sessions = require("express-session");
var CryptoJS = require('crypto-js');
var moment = require('moment');
var passhash = require('password-hash-and-salt');
var security;
var userArray = [];
var session;

function UserConstruct(username, email) {
  this.username = username;
  this.email = email;
}


var gameObjectArray = [{
  gameStart: false,
  timeSettings: "none",
  playersJoined: 0,
  playerOne: {
    email: "",
    username: "playerOne",
    color: "",
    rating: "",
    ready: false
  },
  playerTwo: {
    email: "",
    username: "playerTwo",
    color: "",
    rating: "",
    ready: false
  }
}];







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






  // posts username/email object to the route
  app.post("/api/users", function (req, res) {
    db.User.findAll({})
      .then(function (data) {
        var n = data.length;
        console.log(data[0].dataValues.username);
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
    console.log(session);

    session.newRegister = false;
    //checks hash against hash for entry validation
    db.User.findOne({
      where: {
        email: email
      }
    }).then(function (data) {

      var parsedKey = data.dataValues.security;
      var userName = data.dataValues.username;


      // Verifying a hash 
      passhash(password).verifyAgainst(parsedKey, function (error, verified) {
        if (error) {

          console.log(error);
        }
        if (!verified) {
          console.log("Don't try! We got you!");
        } else {
          session.loggedIn = true;

          session.uniqueID = [data.dataValues.email, data.dataValues.username, data.dataValues.rating];
          console.log(session.uniqueID);
          console.log(session);
          res.redirect('/');
          console.log("you have successfully logged in");
        }
      });
    });
  });

  app.get("/loggedIn", function (req, res) {
    res.json(req.session);
  });

  app.post("/game", function (req, res) {
    var joined = req.body;
    console.log(joined)
    res.json(joined);
  });


  app.get("/game", function (req, res) {

    res.json(gameObject);
  });

};