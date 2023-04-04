const express = require('express');
const router = express.Router();

/** Get main blogs page */
router.get('/', function(req, res, next) {
    res.json("Blogs");
});

module.exports = router;