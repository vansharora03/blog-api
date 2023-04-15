const express = require('express');
const router = express.Router();
const blogsController = require('../controllers/blogsController');

/** Get main blogs page */
router.get('/', blogsController.GET_all_posts);

/** Get a specific blog post */
router.get('/:postId', blogsController.GET_post);

/** Post a comment */
router.post('/:postId/comments', blogsController.POST_comment);

/** Post a blog post */
router.post('/', blogsController.POST_post);

module.exports = router;