const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');

/** Get main blogs page */
router.get('/', blogsController.GET_all_posts);
module.exports = router;