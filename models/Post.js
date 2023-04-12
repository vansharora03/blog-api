const mongoose = require('mongoose');

/** Specify a post schema */
const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    content: String,
    is_published: Boolean,
    published_date: Date,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

// Utilize schema to export model
module.exports = mongoose.model('Post', PostSchema);