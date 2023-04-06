const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');

/** Get main blogs page */
router.get('/', blogsController.GET_all_posts);

/** Get a specific blog post */
router.get('/:postId', blogsController.GET_post);

module.exports = router;