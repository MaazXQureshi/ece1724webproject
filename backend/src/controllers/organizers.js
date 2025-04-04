const {
  createOrganizer,
  getOrganizerById,
  updateOrganizer,
  deleteOrganizer,
} = require("../database/organizers");
const tagDb = require("../database/tags");

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
      const { tagIds, ...organizerData } = req.body;

      console.log("Org Data to be updated");
      console.log(organizerData);
      console.log("Tag IDs ", tagIds);

      const organizer = await getOrganizerById(organizerId);
      if (!organizer) {
        return res.status(404).json({});
      }

      console.log("Updating organizer");

      const updatedOrganizer = await updateOrganizer(
        organizerId,
        organizerData
      );

      // Now update tags

      console.log("Updating Org Tags");

      tagDb.deleteOrgTags(organizer.id);
      tagDb.createOrgTags(tagIds, organizer.id);

      console.log("Tags were deleted");

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
