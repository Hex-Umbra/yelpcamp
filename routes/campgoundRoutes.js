const express = require("express");
const campgroundModel = require("../models/campgroundModel.js");
const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/ExpressError.js");
const router = express.Router();
const Joi = require("joi");

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
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Data", 400);
    const campgroundSchema = Joi.object({
      campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required(),
      }).required(),
    });
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }
    const newCampground = new campgroundModel(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
  })
);
router.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    res.render("campgrounds/show", { campground });
    console.log(err.message);
    res.status(500).json({ message: err.message });
  })
);
router.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
    res.status(500).json({ message: err.message });
  })
);
router.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await campgroundModel.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
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

//
router.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
router.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh no, Something Went Wrong";
  res.status(status).render("../views/error", { err });
});
//

module.exports = router;
