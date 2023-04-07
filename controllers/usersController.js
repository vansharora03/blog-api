const mongoose = require('mongoose');
const User = require('../models/User');

exports.GET_all_users = async function (req, res, next) {
    // Attempt to get all users from database
    try {
        const users = await User.find().populate("role");
        // Send users as JSON
        res.json(users);
    } catch (err) {
        // Error occurred
        err.message = "Had problems getting all users";
        next(err);
    }
}