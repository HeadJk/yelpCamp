// Requiring local files
const ExpressError = require('./utilities/ExpressError')
const { CampgroundSchema, ReviewSchema } = require('./schemas');
const Campground = require('./models/campground');
const Review = require('./models/review');


// Check user login status and store request url in cookies before redirecting
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login');
    }
    next();
}

// Validate Campground
module.exports.validateCampground = (req, res, next) => {
    const { error } = CampgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

// Validating Campground Author
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${campground.id}`);
    }
    next();
}

// Validating Review Author
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Validating Review Request
module.exports.validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}