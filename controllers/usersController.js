const mongoose = require('mongoose');
const User = require('../models/User');
const Role = require('../models/Role');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

// GET all users
exports.GET_all_users = async function (req, res, next) {
    // Attempt to get all users from database
    try {
        const users = await User.find().populate("role");
        // Send users as JSON
        res.json(users);
    } catch (err) {
        // Error occurred
        err.message = "Had problems getting all users";
        next(err);
    }
}


// GET user by username
exports.GET_user = async function (req, res, next) {
    // Attempt to get user by username
    try {
        const user = await User.findOne({username: req.params.username}).populate("role");
        if (!user) {
            // User does not exist
            throw new Error();
        }
        // Send user as JSON
        res.json(user);
    } catch (err) {
        // Error occurred
        err.message = "Could not find user"
        next(err);
    }
}

const validatePOSTUser =  [
    // Validate and sanitize
    body("first_name")
        .trim()
        .isLength({min: 1})
        .withMessage("First name is required")
        .bail()
        .isAlphanumeric()
        .withMessage("First name must contain only letters and numbers"),
    body("last_name")
        .trim()
        .isLength({min: 1})
        .withMessage("Last name is required")
        .bail()
        .isAlphanumeric()
        .withMessage("Last name must contain only letters and numbers"),
    body("username")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Username is required")
        .bail()
        .isAlphanumeric()
        .withMessage("Username must contain only numbers and letters"),
    body("email")
        .trim()
        .isLength({min: 1})
        .withMessage("Email is required"),
    body("password")
        .trim()
        .isLength({min: 1})
        .escape()
        .withMessage("Password is required")
        .bail()
        .isLength({min: 8})
        .withMessage("Password must be at least 8 characters"),
    body("confirm_password")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Please confirm your password.")
        .bail()
        .custom((value, { req }) => {
            // Check if confirm password === password
            if (value !== req.body.password) {
                return false;
            }
            else {
                return true;
            }
        })
        .withMessage("Passwords must match.")
]

// POST user middleware functions
exports.POST_user = [
   validatePOSTUser,
    async (req, res, next) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Send errors in validation
            return res.json(errors.array());
        }
        
        // Ensure the username is unique
        found = await User.findOne({ username: req.body.username });
        if (found) {
            // Username is in use
            err = new Error()
            err.message = `Username: ${found.username} already in use.`;
            return next(err);
        }

        // Begin saving user

        // hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const defaultRole = await Role.findOne({name: 'commenter'});

        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            role: [defaultRole]
        })

        // Attempt to save user
        try {
            user.save();
        } catch (err) {
            // Pass to error handler
            return next(err);
        }
        return res.json("User saved successfully!");
    }
]
