//
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();
//Importing routes
const campgroundsRouter = require("./routes/campgoundRoutes");
const reviewRouter = require("./routes/reviewRoutes");
//
const app = express();
const MONGO_DB_LINK = process.env.MONGO_DB_LINK;

//

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//
app.get("/", (req, res) => {
  res.render("home");
});

//Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfigs = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfigs));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Routers
app.use("/campgrounds", campgroundsRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);

//Middlewares if an error occurs
//If page doesn't exist
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
//If an error occurs at any point in our application
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh no, Something Went Wrong";
  res.status(status).render("../views/error", { err });
});
//

//Connection
mongoose
  .connect(MONGO_DB_LINK)
  .then(() => {
    console.log("Connecting to the DB");
    app.listen(3000, () => console.log(`Listening here http://localhost:3000`));
  })
  .catch((err) => console.log(err));
