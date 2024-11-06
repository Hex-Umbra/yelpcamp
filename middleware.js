module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;//req.originalUrl stores the path of the current request.
    req.flash("error", "You must sign in first");
    return res.redirect("/login");
  }
  next(); // if user is logged in, proceed to the next route
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
