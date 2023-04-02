const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    content: String,
    is_published: Boolean,
    published_date: Date,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Post', PostSchema);