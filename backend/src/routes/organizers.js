const express = require("express");
const router = express.Router();
const db = require("../database/events");
const middleware = require("../middleware/middleware");

// GET /organizers - Fetch all organizers.
// GET /organizers/:id - Fetch a specific organizer by ID.
// POST /organizers - Create a new organizer.
// PUT /organizers/:id - Update an organizer.
// DELETE /organizers/:id - Delete an organizer.

module.exports = router;
