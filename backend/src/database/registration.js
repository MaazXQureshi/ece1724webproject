const {
  PrismaClient,
  PrismaClientKnownRequestError,
} = require("@prisma/client");
const prisma = new PrismaClient();

const dbOperations = {
  registerUser: async (userId, eventId) => {
    try {
      const registration = await prisma.register.create({
        data: { userId, eventId },
      });
      return registration;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  unregisterUser: async (userId, eventId) => {
    console.log("Uregistered user event", userId, eventId);
    try {
      await prisma.register.delete({
        where: { userId_eventId: { userId, eventId } }, // Huh, apparently you can do this for composite keys
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getUserRegistrations: async (userId) => {
    try {
      const registrations = await prisma.register.findMany({
        where: { userId },
        include: { event: true },
      });
      return registrations;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

module.exports = {
  ...dbOperations,
};
