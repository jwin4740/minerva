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










// Routes
// =============================================================
module.exports = function (app) {

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
          session.loggedIn = true;
          session.uniqueID = [data.email, data.id, data.username];
          console.log(session.uniqueID);
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
        if (error)
          throw new Error('Something went wrong!');
        if (!verified) {
          console.log("Don't try! We got you!");
        } else {
          res.redirect('/');

          console.log("you have successfully logged in");
        }
      });
    });
  });


  // GET route for getting all of the posts
  app.get("/api/posts/", function (req, res) {
    db.Post.findAll({})
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // Get route for returning posts of a specific category
  app.get("/api/posts/category/:category", function (req, res) {
    db.Post.findAll({
        where: {
          category: req.params.category
        }
      })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // Get rotue for retrieving a single post
  app.get("/api/posts/:id", function (req, res) {
    db.Post.findOne({
        where: {
          id: req.params.id
        }
      })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // POST route for saving a new post
  app.post("/api/posts", function (req, res) {
    console.log(req.body);
    db.Post.create({
        title: req.body.title,
        body: req.body.body,
        category: req.body.category
      })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });

  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function (req, res) {
    db.Post.destroy({
        where: {
          id: req.params.id
        }
      })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });
    app.get("/loggedIn", function(req, res) {
    	res.json(req.session);
    });
  // PUT route for updating posts
  app.put("/api/posts", function (req, res) {
    db.Post.update(req.body, {
        where: {
          id: req.body.id
        }
      })
      .then(function (dbPost) {
        res.json(dbPost);
      });
  });
};