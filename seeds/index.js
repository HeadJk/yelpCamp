const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/user');
const Review = require('../models/review')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    const sampleUser = await User.findById('606f365ef5a7c4adcd74423d');
    for (let i = 1; i <= 70; i++) {
        const random1000 = (Math.floor(Math.random() * 1000));
        const price = (Math.floor(Math.random() * 20) + 10);
        const sampleReview1 = new Review({rating: 3, body: 'Decent spot. Pretty windy.', author: sampleUser._id});
        await sampleReview1.save();
        const sampleReview2 = new Review({rating: 5, body: 'Amazing spot. Me and the family had a blast!', author: sampleUser._id});
        await sampleReview2.save();
        const camp = new Campground({
            author: '606f365ef5a7c4adcd74423d',
            location: `${cities[random1000].state}`,
            title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dmbtzn3we/image/upload/v1618066948/YelpCamp/yarvinifm535siovpdog.jpg',
                    filename: 'YelpCamp/yarvinifm535siovpdog'
                },
                {
                    url: 'https://res.cloudinary.com/dmbtzn3we/image/upload/v1618066947/YelpCamp/d0qtlui3teq1xuk4h8xg.jpg',
                    filename: 'YelpCamp/d0qtlui3teq1xuk4h8xg'
                }
            ],
            reviews: [sampleReview1, sampleReview2],
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus harum voluptatibus vitae eaque doloremque reprehenderit voluptate officiis maxime aliquid nesciunt quas est corporis possimus perspiciatis blanditiis cum aperiam, quisquam voluptatum.",
            price: price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})