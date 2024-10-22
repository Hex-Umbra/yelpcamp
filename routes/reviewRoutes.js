const express = require("express");
const router = express.Router({mergeParams:true});

const campgroundModel = require("../models/campgroundModel.js");
const reviewModel = require("../models/reviewModel.js");

const catchAsync = require("../Utils/catchAsync");
const ExpressError = require("../Utils/ExpressError.js");

const { reviewSchema } = require("../Utils/joiSchemas.js");

//Function to check if the information sent by the server is valid and can be saved in the db.
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

// Post route to create a new review and associate it with a campground.
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await campgroundModel.findById(req.params.id);
    const review = new reviewModel(req.body.review);
    campground.reviews.push(review); //Adding review to the campground
    await review.save(); //save the review
    await campground.save(); //save the campground
    req.flash("success", "Thank you for the review !");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//Delete route to delete a specific review
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    //We need to remove the reference of the review in the campground
    const { id, reviewId } = req.params;
    await campgroundModel.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    }); //Using a mongoose operator "$pull" to remove the review from the campground in the reviews array by matching it with the reviewId
    //And then remove the review itself
    await reviewModel.findByIdAndDelete(reviewId);
    req.flash("success", "The review is deleted !");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
