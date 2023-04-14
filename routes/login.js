const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

/** Log user in and return token */
router.post('/', usersController.login);

module.exports = router;