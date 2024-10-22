const express = require("express");
const router = express.Router();
const campgroundModel = require("../models/campgroundModel.js");
const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/ExpressError.js");
const { campgroundSchema } = require("../Utils/joiSchemas.js");

//Function to check if the information sent by the server is valid and can be saved in the db.
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await campgroundModel.find();
    res.render("campgrounds/index", { campgrounds });
  })
);
router.get("/new", async (req, res) => {
  res.render("campgrounds/new");
});
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newCampground = new campgroundModel(req.body.campground);
    await newCampground.save();
    req.flash("success", "Campground created successfully!");
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await campgroundModel.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
    res.status(500).json({ message: err.message });
  })
);
router.put(
  "/:id",
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
router.delete("/:id", async (req, res) => {
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
