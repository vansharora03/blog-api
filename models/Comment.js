const mongoose = require('mongoose');

/** Specify a comment schema */
const CommentSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: String,
    time_stamp: Date
});

// Utilize schema to export model
module.exports = mongoose.model('Comment', CommentSchema);