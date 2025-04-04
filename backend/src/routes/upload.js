const express = require("express");
const router = express.Router();
const middleware = require("../middleware/middleware");
const controller = require("../controllers/upload");

// Upload route
router.post("/", middleware.upload, controller.uploadImage);

module.exports = router;
