const mongoose = require('mongoose');

// Specify a user schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: [{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}]
})

// Utilize schema to export model
module.exports = mongoose.model('User', UserSchema);