const express = require("express");
const campgroundModel = require("../models/campgroundModel.js");
const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/ExpressError.js");
const router = express.Router();
const {campgroundSchema} = require("../Utils/joiSchemas.js")


//Function to check if the information sent by the server is valid and can be saved in the db.
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  }else(next)
};

router.get(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campgrounds = await campgroundModel.find();
    res.render("campgrounds/index", { campgrounds });
  })
);
router.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/new");
});
router.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newCampground = new campgroundModel(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
router.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res,next) => {
    const campground = await campgroundModel.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
    res.status(500).json({ message: err.message });
  })
);
router.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res,next) => {
    const { id } = req.params;
    const campground = await campgroundModel.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
    res.status(500).json({ message: err.message });
  })
);
router.get(
  "/campgrounds/:id",
  catchAsync(async (req, res,next) => {
    const campground = await campgroundModel.findById(req.params.id);
    res.render("campgrounds/show", { campground });
    console.log(err.message);
    res.status(500).json({ message: err.message });
  })
);
router.delete("/campgrounds/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampground = await campgroundModel.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

//Middlewares if an error occurs
//If page doesn't exist
router.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
//If an error occurs at any point in our application
router.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh no, Something Went Wrong";
  res.status(status).render("../views/error", { err });
});
//

module.exports = router;
