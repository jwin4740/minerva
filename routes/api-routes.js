// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");
var path = require("path");
var sessions = require("express-session");
var crypto = require('crypto');

var session;

//hash functions
const sha512 = (password, salt) => {
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    let value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

const genRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

// Routes
// =============================================================
module.exports = function(app) {



    //REGISTER NEW USER
    app.post("/users/register", function(req, res, next) {
        //Validation - checks if form is filled out properly
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();

        if (errors) { //if errors restart register page
            req.session.errors = errors;
            req.session.success = false;
            res.render('register', {
                errors: errors
            });
        } else { //else look if there is a current user with same username or same email address

        	db.User.findAll({
    	   	where: {
    	   		$or: [
    		   		{
    		   			username: req.body.username
    		   		},
    		   		{
    		   			email: req.body.email
    	   			}
    	   		]
    	   	}
    	   	}).then(function(userResults) {
    	   		if(userResults.length){ //if there is a match of same name, restart register page
    	   			res.render('register', {
                    errors: [{msg: "Username or e-mail already in use"}]
                });
    	   		}else { //else hash password and create the user

    	   			req.session.success = true;

                    var salt = genRandomString(32);
                    var hashedPassword = sha512(req.body.password, salt).passwordHash;

                    db.User.create({
                        email: req.body.email,
                        username: req.body.username,
                        hash: hashedPassword,
                        salt: salt
                    }).then(function(result) {
                        // redirect to user.html with username in welcome message
                         req.session.newRegister = true;
                        res.redirect('/');
                    });   		
                }

    	   	});
        }
    });

    //SESSION LOGIN
    app.post("/login", function(req, res) {
        var session = req.session;
        var email = req.body.email;
        var password = req.body.password;
        console.log("am here");
         session.newRegister = false;
        //checks hash against hash for entry validation
        db.User.findOne({
            where: {
                email: email
            }
        }).then(function(data) {
             var salt = data.salt;
            var hashedPassword = sha512(req.body.password, salt).passwordHash;
            if (hashedPassword === data.hash) {
            	session.loggedIn = true;
                session.uniqueID = [data.email, data.role, data.id, data.username];
                if (data.role === "admin") {
                    res.send({redirect: '/admin'});
                } else if (data.role === "user") {
                    res.send({redirect: '/user/' + data.id});
                } else {
                    console.log('No role found');
                }
            } else {
                console.log("Illegal entry detected.");
                 res.status(400).send();
                  }


        
        }).catch(function(err) {
            console.log("The error is" + err);
            res.status(400).send();
        });
    });

  // GET route for getting all of the posts
  app.get("/api/posts/", function(req, res) {
    db.Post.findAll({})
    .then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for returning posts of a specific category
  app.get("/api/posts/category/:category", function(req, res) {
    db.Post.findAll({
      where: {
        category: req.params.category
      }
    })
    .then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get rotue for retrieving a single post
  app.get("/api/posts/:id", function(req, res) {
    db.Post.findOne({
      where: {
        id: req.params.id
      }
    })
    .then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // POST route for saving a new post
  app.post("/api/posts", function(req, res) {
    console.log(req.body);
    db.Post.create({
      title: req.body.title,
      body: req.body.body,
      category: req.body.category
    })
    .then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/posts/:id", function(req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // PUT route for updating posts
  app.put("/api/posts", function(req, res) {
    db.Post.update(req.body,
      {
        where: {
          id: req.body.id
        }
      })
    .then(function(dbPost) {
      res.json(dbPost);
    });
  });
};
