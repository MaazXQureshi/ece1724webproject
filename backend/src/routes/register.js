const express = require("express");
const router = express.Router();
const controller = require("../controllers/register");
const middleware = require("../middleware/middleware");

// Subscribe to event
router.post("/", controller.registerUser);

// Unsubscribe user from event
router.delete("/", controller.unregisterUser);

// Get all registrations for a user
router.get(
  "/:id",
  middleware.validateResourceId,
  controller.getUserRegistrations
);

module.exports = router;
