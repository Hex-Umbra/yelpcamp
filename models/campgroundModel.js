const mongoose = require("mongoose");
const reviewModel = require("./reviewModel");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  image: String,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

//Using a query Middleware to remove the reviews associated with the campground
CampgroundSchema.post("findOneAndDelete", async function (campground) {
  if (campground) {
    await reviewModel.deleteMany({
      _id: {
        $in: campground.reviews,
      },
    });
    //Removing all reviews associated with the campground by looking at the campground's reviews array with the mongoose "$in" operator to remove them from the Review Collection now that their campground has been deleted.
  }
}); // this is a middleware function that runs whenever a Campground is deleted

module.exports = mongoose.model("Campground", CampgroundSchema);
