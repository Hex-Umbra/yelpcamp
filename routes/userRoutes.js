const express = require("express");
const router = express.Router();
const catchAsync = require("../Utils/catchAsync");
const userModel = require("../models/userModel");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

//Register Routes
//Route to the form
router.get("/register", (req, res) => {
  res.render("users/register");
});
//Route to register the user in the database
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const newUser = userModel({ email, username });
      const registeredUser = await userModel.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Yelpcamp !");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
  })
);

//Login Routes
//Route to the login form
router.get("/login", (req, res) => {
  res.render("users/login");
});
//Route to login the user
router.post(
  "/login",
  storeReturnTo, //Store the page the user was on before login
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Yelpcamp !");
    const redirectUrl = res.locals.returnTo || "/campgrounds";    
    res.redirect(redirectUrl);
  }
);

//Logout Routes
//Route to logout the user
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "See you next time!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
