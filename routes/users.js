// Requiring packages
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Requiring local files
const catchAsync = require('../utilities/catchAsync')
const users = require('../controllers/users')


// Functions found in users controller

router.route('/register')
    // Showing register page
    .get(users.showCreateUser)
    // Creating new user
    .post(catchAsync(users.createUser))

router.route('/login')
    // Showing login page
    .get(users.showLogin)
    // Logging in user
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.loginUser)

// Logout user
router.get('/logout', users.logoutUser)

// Exporting users router
module.exports = router;