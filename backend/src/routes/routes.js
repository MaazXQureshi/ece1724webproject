const express = require("express");
const router = express.Router();
const eventRoutes = require("./events");
const organizerRoutes = require("./organizers");
const userRoutes = require("./user");
const tagsRoutes = require("./tags");

// Mount routes
router.use("/events", eventRoutes);
router.use("/organizers", organizerRoutes);
router.use("/user", userRoutes);
router.use("/tags", tagsRoutes);

module.exports = router;
