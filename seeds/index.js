const mongoose = require("mongoose");
const cities = require("./cities");
const MONGO_DB_LINK =
  "mongodb+srv://admin:adminroot@yelpcamp.sh3tw.mongodb.net/Yelpcamp";
const Campground = require("../models/campgroundModel");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect(MONGO_DB_LINK);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};
seedDb().then(() => {
  mongoose.connection.close();
});
