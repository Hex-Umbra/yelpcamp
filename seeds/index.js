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
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://picsum.photos/400?random${Math.random()}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat quisquam quasi reprehenderit corporis cumque voluptatum molestiae necessitatibus sint aliquam in cum consequatur, praesentium blanditiis iusto debitis accusantium natus quia dignissimos?",
      price,
    });
    await camp.save();
  }
};
seedDb().then(() => {
  mongoose.connection.close();
});
