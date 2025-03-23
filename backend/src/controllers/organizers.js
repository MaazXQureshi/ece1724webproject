const {
  createOrganizer,
  getOrganizerById,
  updateOrganizer,
  deleteOrganizer,
} = require("../database/organizers");

const organizerController = {
  createOrganizer: async (req, res) => {
    try {
      const organizerData = req.body;
      const organizer = await createOrganizer(organizerData);
      return res.status(201).json(organizer);
    } catch (error) {
      return res.status(500);
    }
  },
  getOrganizerById: async (req, res) => {
    try {
      const organizerId = parseInt(req.params.id, 10);
      const organizer = await getOrganizerById(organizerId);

      if (!organizer) {
        return res.status(404).json({});
      }

      return res.status(200).json(organizer);
    } catch (error) {
      return res.status(500);
    }
  },
  updateOrganizer: async (req, res) => {
    try {
      const organizerId = parseInt(req.params.id, 10);
      const organizerData = req.body;

      const organizer = await getOrganizerById(organizerId);
      if (!organizer) {
        return res.status(404).json({});
      }

      const updatedOrganizer = await updateOrganizer(
        organizerId,
        organizerData
      );
      return res.status(200).json(updatedOrganizer);
    } catch (error) {
      return res.status(500).json({});
    }
  },
  deleteOrganizer: async (req, res) => {
    try {
      const organizerId = parseInt(req.params.id, 10);

      const organizer = await getOrganizerById(organizerId);
      if (!organizer) {
        return res.status(404).json({});
      }

      await deleteOrganizer(organizerId);
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({});
    }
  },
};

module.exports = {
  ...organizerController,
};
