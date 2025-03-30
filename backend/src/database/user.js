const {
  PrismaClient,
  PrismaClientKnownRequestError,
} = require("@prisma/client");
const prisma = new PrismaClient();

// TODO: Implement User related database operations
const dbOperations = {
  createUser: async (userData) => {
    try {
      return await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          passwordHash: userData.hashedPassword,
          admin: userData.admin,
        },
      });
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  },
  getUserByEmail: async (email) => {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      throw new Error("Error retrieving user by email: " + error.message);
    }
  },
  getUserById: async (id) => {
    try {
      return await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: { organizer: true },
      });
    } catch (error) {
      throw new Error("Error retrieving user by ID: " + error.message);
    }
  },
  updateUserById: async (id, userData) => {
    try {
      return await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          email: userData.email,
          username: userData.username,
          admin: userData.admin,
        },
      });
    } catch (error) {
      throw new Error("Error updating user by ID: " + error.message);
    }
  },
  deleteUserById: async (id) => {
    try {
      return await prisma.user.delete({ where: { id: parseInt(id) } });
    } catch (error) {
      throw new Error("Error deleting user by ID: " + error.message);
    }
  },
};

module.exports = {
  ...dbOperations,
};
