// Requiring Packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Creating user schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// Appending username and password to schema
UserSchema.plugin(passportLocalMongoose);

// Exporting model
module.exports = mongoose.model('User', UserSchema);