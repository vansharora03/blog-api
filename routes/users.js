const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

/** Get all users */
router.get('/', usersController.GET_all_users);

/** Get user by username */
router.get('/:username', usersController.GET_user)

module.exports = router;