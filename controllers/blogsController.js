const Post = require('../models/Post');
const mongoose = require('mongoose');

exports.GET_all_posts = async function (req, res, next) {
    // Attempt to get all posts from the database
    try {
        const posts = await Post.find().populate("author");
        // Got posts, send to client
        res.json(posts);
    } catch (err) {
        // Error occurred
        next(err);
    }
}