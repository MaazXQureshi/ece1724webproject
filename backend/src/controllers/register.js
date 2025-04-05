const registerDb = require("../database/register");

const registerController = {
  registerUser: async (req, res) => {
    try {
      const { userId, eventId } = req.body;
      const registration = await registerDb.registerUser(userId, eventId);
      return res.status(201).json(registration);
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ error: "Failed to register user" });
    }
  },
  unregisterUser: async (req, res) => {
    try {
      const { userId, eventId } = req.body;
      await registerDb.unregisterUser(userId, eventId);
      return res.status(200).json({ message: "Unregistered successfully" });
    } catch (error) {
      console.error("Unregistration error:", error);
      return res.status(500).json({ error: "Failed to unregister user" });
    }
  },
  getUserRegistrations: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const registrations = await registerDb.getUserRegistrations(userId);
      return res.status(200).json(registrations);
    } catch (error) {
      console.error("Fetch error:", error);
      return res.status(500).json({ error: "Failed to fetch registrations" });
    }
  },
};

module.exports = {
  ...registerController,
};
