const express = require("express");
const router = express.Router();
const controller = require("../controllers/events");
const db = require("../database/events");
const middleware = require("../middleware/middleware");

// GET /events - Fetch all events.
// GET /events/:id - Fetch a specific event by ID.
// POST /events - Create a new event.
// PUT /events/:id - Update an event.
// DELETE /events/:id - Delete an event.
// POST /events/:id/register - Register a user for an event (RSVP)
// TODO: GET /user-events - Get all events that a user registered for

router.post('/', middleware.validateEventData, controller.createEvent);
router.get('/', middleware.validateEventQuery, controller.getAllEvents);
router.get('/:id', middleware.validateResourceId, controller.getEventById);
router.put('/:id', middleware.validateResourceId, middleware.validateEventData, controller.updateEvent);
router.delete('/:id', middleware.validateResourceId, controller.deleteEvent);
router.post('/register', controller.respondToEvent);
router.post('/unregister', controller.unregisterForEvent);

module.exports = router;
