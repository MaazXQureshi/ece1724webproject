const {
  PrismaClient,
  PrismaClientKnownRequestError,
} = require("@prisma/client");
const prisma = new PrismaClient();

const dbOperations = {
  createOrganizer: async (orgData) => {
    try {
      const organizer = await prisma.organizer.create({
        data: {
          name: orgData.name,
          info: orgData.info,
          email: orgData.email,
          phone: orgData.phone,
          imageUrl: orgData.imageUrl,
          adminId: orgData.adminId, // Must provide an existing user ID
        },
      });

      return organizer;
    } catch (err) {
      console.error("Error creating organizer: ", err);
      throw err;
    }
  },
  getOrganizerById: async (orgId) => {
    try {
      const organizer = await prisma.organizer.findUnique({
        where: { orgId },
        include: { admin: true, events: true, orgTags: true },
      });

      if (!organizer) throw new Error("Organizer not found");

      return organizer;
    } catch (err) {
      console.error("Error fetching organizer: ", err);
      throw err;
    }
  },
  updateOrganizer: async (orgId, orgData) => {
    try {
      const updatedOrganizer = await prisma.organizer.update({
        where: { orgId },
        orgData,
      });

      return updatedOrganizer;
    } catch (err) {
      console.error("Error updating organizer: ", err);
      throw err;
    }
  },
  deleteOrganizer: async (orgId) => {
    try {
      // Delete all event registrations linked to the organizer's events
      await prisma.register.deleteMany({
        where: {
          event: {
            clubId: id,
          },
        },
      });

      // Delete all events belonging to the organizer
      await prisma.event.deleteMany({
        where: {
          clubId: id,
        },
      });

      // Delete all tags associated with the organizer
      await prisma.orgTag.deleteMany({
        where: {
          orgId: id,
        },
      });

      // Delete the organizer (this also deletes the associated admin)
      await prisma.organizer.delete({
        where: { id },
      });

      return {
        message: "Organizer and associated admin user deleted successfully",
      };
    } catch (err) {
      console.error("Error deleting organizer and related data:", err);
      throw err;
    }
  },
};

module.exports = {
  ...dbOperations,
};
