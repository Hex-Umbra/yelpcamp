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
    res.render("campgrounds/new");
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});
router.post("/campgrounds", async (req, res) => {
  try {
    const newCampground = new campgroundModel(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/campgrounds/:id", async (req, res) => {
  try {
    const campground = await campgroundModel.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});
router.get("/campgrounds/:id/edit", async(req,res)=>{
  try {
    const campground = await campgroundModel.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
})
router.put("/campgrounds/:id/", async(req,res)=>{
  try {
    const {id} = req.params;
    const campground = await campgroundModel.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})
router.delete("/campgrounds/:id", async(req,res)=>{
try {
    const {id} = req.params;
    const deletedCampground = await campgroundModel.findByIdAndDelete(id);
    res.redirect("/campgrounds")
} catch (error) {
  res.status(500).json({ message: err.message });
}  
})

module.exports = router;
