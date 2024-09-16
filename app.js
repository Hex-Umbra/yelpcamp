//
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
//
const campgroundsRouter = require("./routes/campgoundRoutes");
//
const app = express();
const MONGO_DB_LINK =
  "mongodb+srv://admin:adminroot@yelpcamp.sh3tw.mongodb.net/Yelpcamp";
//
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//
app.get("/", (req, res) => {
  res.render("home");
});
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(campgroundsRouter);

mongoose
  .connect(MONGO_DB_LINK)
  .then(() => {
    console.log("Connecting to the DB");
    app.listen(3000, () => console.log(`Listening here http://localhost:3000`));
  })
  .catch((err) => console.log(err));
