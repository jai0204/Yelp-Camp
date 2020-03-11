var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Root route
router.get('/', function (req, res) {
  res.render("landing");
});

//Auth Routes
//Sign Up form
router.get('/register', function (req, res) {
  res.render("register");
});

//Sign Up route
router.post('/register', function (req, res) {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("back");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome to YelpCamp " + user.username);
      res.redirect("/campgrounds");
    });
  });
});

//Login form
router.get('/login', function (req, res) {
  res.render("login");
});

//Login route
router.post('/login', passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function (req, res) {
});

//Logout route
router.get('/logout', function (req, res) {
  req.logout();
  req.flash("success", "Logged you out!")
  res.redirect("/campgrounds");
});

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
