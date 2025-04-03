const express = require("express");
const router = express.Router();
const controller = require("../controllers/organizers");
const db = require("../database/events");
const middleware = require("../middleware/middleware");

// GET /organizers - Fetch all organizers. (Probably not needed)
// GET /organizers/:id - Fetch a specific organizer by ID.
// POST /organizers - Create a new organizer.
// PUT /organizers/:id - Update an organizer.
// DELETE /organizers/:id - Delete an organizer.

router.post("/", middleware.validateOrganizerData, controller.createOrganizer);
router.get("/:id", middleware.validateResourceId, controller.getOrganizerById);
router.put(
  "/:id",
  middleware.validateResourceId,
  // middleware.validateOrganizerData,
  middleware.authenticate,
  middleware.authorizeOrganizerAdmin,
  controller.updateOrganizer
);
router.delete(
  "/:id",
  middleware.validateResourceId,
  controller.deleteOrganizer
);

module.exports = router;
