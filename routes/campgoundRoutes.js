const express = require("express");
const campgroundModel = require("../models/campgroundModel.js");
const router = express.Router();

router.get("/campgrounds", async (req, res) => {
  try {
    const campgrounds = await campgroundModel.find();
    res.render("campgrounds/index",{campgrounds})
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});
router.post("/campground", async (req, res) => {
  try {
    const newCamp = req.body;
    await campgroundModel.create(newCamp);
    res.status(200).json(newCamp);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
