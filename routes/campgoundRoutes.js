const express = require("express");
const router = express.Router();
const campgroundModel = require("../models/campgroundModel.js");
const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/ExpressError.js");
const { campgroundSchema } = require("../Utils/joiSchemas.js");
const {isLoggedIn} = require("../middleware.js")

//Function to check if the information sent to the server is valid and can be saved in the db.
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

//Get routes for all campgrounds
router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await campgroundModel.find();
    res.render("campgrounds/index", { campgrounds });
  })
);

//Get route to show the form for a new campground
router.get("/new",isLoggedIn, async (req, res) => {
  res.render("campgrounds/new");
});

//Post routes to create a new campground after submitting the form
router.post(
  "/",
  validateCampground,
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const newCampground = new campgroundModel(req.body.campground);
    await newCampground.save();
    req.flash("success", "Campground created successfully!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);

//Get route to show the details of a campground and the form to edit it
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const campground = await campgroundModel.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
    res.status(500).json({ message: err.message });
  })
);

//Put route to submit all the updates made to the campground
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await campgroundModel.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Campground updated successfully!");
    res.redirect(`/campgrounds/${campground._id}`);
    res.status(500).json({ message: err.message });
  })
);

//Show Route for a specific campground
router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const campground = await campgroundModel
      .findById(req.params.id)
      .populate("reviews");
    if (!campground) {
      req.flash("error", "The requested campground does not exist");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", { campground });
  })
);

//Delete route to delete a campground
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampground = await campgroundModel.findByIdAndDelete(id);
    req.flash("success", "Campground deleted successfully!");
    res.redirect("/campgrounds");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
