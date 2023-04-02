const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content: String,
    time_stamp: Date
});

module.exports = mongoose.model('Comment', CommentSchema);