const express = require("express");
const router = express.Router();
const controller = require("../controllers/tags");
const db = require("../database/events");
const middleware = require("../middleware/middleware");

// GET / - Get tags by filter

router.get('/', middleware.validateTagQuery, controller.getTags);

module.exports = router;
