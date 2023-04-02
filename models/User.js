const mongoose = require('mongoose');

// Specify a user schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    can_create: Boolean
})

// Utilize schema to export model
module.exports = mongoose.model('User', UserSchema);