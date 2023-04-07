const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.GET_all_users);

router.get('/:username', usersController.GET_user)

module.exports = router;