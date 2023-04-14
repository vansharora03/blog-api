const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

/** Post the signed in user if successful */
router.post('/', usersController.POST_user);

module.exports = router;