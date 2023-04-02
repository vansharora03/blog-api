const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    can_create: Boolean
})

module.exports = mongoose.model('User', UserSchema);