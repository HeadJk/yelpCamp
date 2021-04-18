const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_150');
})

ImageSchema.virtual('cardImage').get(function() {
    return this.url.replace('/upload', '/upload/c_fill,w_300,h_300');
})

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: {
        type: [ImageSchema],
        validate: [arrayLimit, 'Cannot upload more than 5 images']
    },
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    price: Number,
    description: {
        type: String,
        maxLength: 250
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);

function arrayLimit(val) {
    return val.length <= 5;
}

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description.substring(0, 80)}...</p>`;
})

CampgroundSchema.virtual('properties.avgRating').get(function() {
    let sum = 0;
    for(let review of this.reviews){
        sum += review.rating;
    }
    return (sum / this.reviews.length).toFixed(1);
})

CampgroundSchema.virtual('properties.shortDescription').get(function() {
    return `${this.description.slice(0, 200)}...`;
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);