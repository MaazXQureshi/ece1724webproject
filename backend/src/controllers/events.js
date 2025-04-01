const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  respondToEvent,
  unregisterEvent,
} = require('../database/events')

const eventController = {
  createEvent: async (req, res) => {
    try {
      const eventData = req.body;
      const event = await createEvent(eventData);
      return res.status(201).json(event);
    } catch (error) {
      return res.status(500);
    }
  },
  getAllEvents: async (req, res) => {
    try {
      const filters = {
        name: req.query.name,
        date: req.query.date,
        location: req.query.location,
        hours: parseInt(req.query.hours, 10),
        tags: req.query.tags,
        limit: parseInt(req.query.limit, 10) || 10,
        offset: parseInt(req.query.offset, 10) || 0
      }; // Extract filters from query parameters

      const events = await getAllEvents(filters);
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500);
    }
  },
  getEventById: async (req, res) => {
    try {
      const eventId = parseInt(req.params.id, 10);
      const event = await getEventById(eventId);

      if (!event) {
        return res.status(404).json({})
      }

      return res.status(200).json(event);
    } catch (error) {
      return res.status(500);
    }
  },
  updateEvent: async (req, res) => {
    try {
      const eventId = parseInt(req.params.id, 10);
      const eventData = req.body;

      const event = await getEventById(eventId);
      if (!event) {
        return res.status(404).json({})
      }

      const updatedEvent = await updateEvent(eventId, eventData);
      return res.status(200).json(updatedEvent);
    } catch (error) {
      return res.status(500).json({});
    }
  },
  deleteEvent: async (req, res) => {
    try {
      const eventId = parseInt(req.params.id, 10);

      const event = await getEventById(eventId);
      if (!event) {
        return res.status(404).json({})
      }

      await deleteEvent(eventId);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({});
    }
  },
  respondToEvent: async (req, res) => {
    try {
      const {userId, eventId} = req.body;

      if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(eventId) || eventId <= 0) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid ID format",
        });
      }

      const response = await respondToEvent(userId, eventId);
      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({});
    }
  },
  unregisterForEvent: async (req, res) => {
    try {
      const {userId, eventId} = req.body;

      if (!Number.isInteger(userId) || userId <= 0 || !Number.isInteger(eventId) || eventId <= 0) {
        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid ID format",
        });
      }

      await unregisterEvent(userId, eventId);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({});
    }
  },
};

module.exports = {
  ...eventController,
};
