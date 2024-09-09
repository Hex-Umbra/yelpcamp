const express = require("express");
const campgroundModel = require("../models/campgroundModel.js");
const router = express.Router();

router.get("/campgrounds", async (req, res) => {
  try {
    const campgrounds = await campgroundModel.find();
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});
router.get("/campgrounds/new", async (req, res) => {
  try {
    res.render("campgrounds/new")
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});
router.post("campgrounds", async(req,res)=>{
  res.send(req.body)
})
router.get("/campgrounds/:id", async (req, res) => {
  try {
    const campground = await campgroundModel.findById(req.params.id);
    res.render("campgrounds/show",{ campground });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
