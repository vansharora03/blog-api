const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');
const authenticate = require('./usersController').authenticateFromJwt;
const { body, validationResult } = require('express-validator');
  

/** Get all blog posts */
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

/** Get a blog post by id */
exports.GET_post = async function (req, res, next) {
    const postId = req.params.postId

    // Attempt to get the post with the postId
    try {
        const post = await Post.findById(postId).populate("author comments");
        // Got post, send to client
        res.json(post);
    } catch (err) {
        // Error occurred
        err.message = err.toString();
        next(err);
    }
}


/** Validate and sanitize post data */
const validatePOSTPost = [
    body("title")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Title is required.")
        .isLength({ max: 100 })
        .withMessage("Title must be less than 100 characters."),
    body("content")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Post must have content."),
]

/** Post a blog post */
exports.POST_post = [
    authenticate,
    // Ensure that user is a creator
    (req, res, next) => {
        if (req.user.role.length > 1 && req.user.role[1].name === "creator") {
            // Continue if user is creator
            next()
        } else {
            // Pass to error handler otherwise
            const err = new Error(`User: ${req.user.username} is not a creator`);
            err.status = 403;
            next(err);
        }
    },
    validatePOSTPost,
    // Begin processing post request
    async (req, res, next) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // There are errors, send them
            return res.json(errors.array());
        }
        const author = await User.findOne({ username: req.user.username });
        const found = await Post.findOne({ title: req.body.title });
        if (found) {
            const err = new Error(`Title: ${found.title} is already taken.`);
            err.status = 400;
            return next(err);
        }
        // No errors, begin saving
        const post = new Post({
            author,
            title: req.body.title,
            content: req.body.content,
            is_published: false,
        })

        // Attempt to save post
        try {
            await post.save()
        } catch (err) {
            return next(err);
        }
        return res.json(post);
    }


]

/** Validate and sanitize comment */
const validateComment = [
    body("content")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Comment cannot be empty.")
        .isLength({max: 200})
        .withMessage("Comment must not exceed 200 characters.")
]

/** POST comment to certain blog */
exports.POST_comment = [
    authenticate,
    validateComment,
    async (req, res, next) => {
        // Extract errors
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            // Send errors
            return res.json(errors.array());
        }

        // Attempt to save comment

        // Get post
        const post = await Post.findById(req.params.postId).populate("author comments");
        // Get comments array
        const comments = post.comments;
        // Get user
        const author = await User.findOne({username: req.user.username});
        
        // Create new comment
        const comment = new Comment({
            author,
            content: req.body.content,
            time_stamp: new Date()
        })

        try {
            // Save comment to database
            await comment.save();
            // Push comment to comments array
            comments.push(comment);
            await Post.findByIdAndUpdate(req.params.postId, {comments})
            res.json(comment);
        } catch (err) {
            next(err);
        }
    }
]