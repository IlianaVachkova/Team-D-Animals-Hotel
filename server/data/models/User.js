"use strict";

const mongoose = require('mongoose'),
    encryption = require('../../utilities/encryption');

const requiredMessage = '{PATH} is required';
const defaultAvatar = 'http://www.luxepethotels.com/wp-content/uploads/2013/10/Indoor-play-time-at-Luxe-Pet-Hotels-4.jpg';

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    hashPass: { type: String, required: true },
    salt: { type: String, required: true },
    phoneNumber: String,
    email: { type: String, required: true},
    //initiatives: [{
    //    initiative: String,
    //    season: String
    //}],
    avatar: { type: String, default: defaultAvatar },
    pets: []
});

userSchema.method({
    authenticate: function(password) {
        if (encryption.generateHashedPassword(this.salt, password) === this.hashPass) {
            return true;
        }
        else {
            return false;
        }
    }
});

const User = mongoose.model("user", userSchema);
module.exports = User;
