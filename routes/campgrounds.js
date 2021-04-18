// Require Packages
const express = require('express');
const router = express.Router();
const multer  = require('multer')

// Require Local Files
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// Functions found in campgrounds controller

router.route('/')
    // Show All Campgrounds Page
    .get(catchAsync(campgrounds.showAllCampgrounds))
    // Create New Campground
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

// Show User Campgrounds
router.get('/owned', isLoggedIn, catchAsync(campgrounds.showUserCampgrounds))

// Show New Campground Page
router.get('/new', isLoggedIn, campgrounds.showCreateCampground)

router.route('/:id')
    // Show Specific Campground Page
    .get(catchAsync(campgrounds.showCampground))
    // Edit Campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))
    // Delete Campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


// Show Campground Edit Page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.showEditCampground))

// Export to app.js router
module.exports = router;