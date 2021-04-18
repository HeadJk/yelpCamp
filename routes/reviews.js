// Require packages
const express = require('express');
const router = express.Router({mergeParams: true});

// Require local files
const catchAsync = require('../utilities/catchAsync');
const reviews = require('../controllers/reviews')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

// Functions found in reviews controller

// Create new review
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview))

// Delete Review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

// Export to app.js router
module.exports = router;