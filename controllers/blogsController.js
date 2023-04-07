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
        err.message = "Had problems getting all posts";
        next(err);
    }
}

exports.GET_post = async function (req, res, next) {
    const postId = req.params.postId

    // Attempt to get the post with the postId
    try {
        const post = await Post.findById(postId).populate("author").populate("comments");
        // Got post, send to client
        res.json(post);
    } catch (err) {
        // Error occurred
        err.message = "Couldn't find post";
        next(err);
    }
}