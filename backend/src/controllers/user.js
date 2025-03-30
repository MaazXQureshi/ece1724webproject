const userDb = require("../database/user");
const orgDb = require("../database/organizers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userController = {
  // TODO: Need to add better error checking
  registerUser: async (req, res) => {
    const {
      email,
      username,
      password,
      admin,
      organizerName,
      organizerInfo,
      organizerEmail,
      organizerPhone,
      organizerImageUrl,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      email,
      username,
      hashedPassword,
      admin,
    };

    try {
      const user = await userDb.createUser(userData);
      if (admin) {
        // If the user is an admin, create an organizer and associate the user as the admin
        const organizerData = {
          name: organizerName,
          info: organizerInfo,
          email: organizerEmail,
          phone: organizerPhone,
          imageUrl: organizerImageUrl,
          adminId: user.id,
        };
        await orgDb.createOrganizer(organizerData);
      }
      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "User already exists" });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    const user = await userDb.getUserByEmail(email);
    if (!user) return res.status(400).json({ error: "User not found" });
    console.log("User found");
    console.log(user);
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, admin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Login successful", admin: user.admin });
  },
  logoutUser: (req, res) => {
    res.clearCookie("token").json({ message: "Logged out successfully" });
  },
  getProfile: (req, res) => {
    res.json({ message: "Access granted", user: req.user });
  },
  getUser: async (req, res) => {
    const user = await userDb.getUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  },
  updateUser: async (req, res) => {
    const { email, admin } = req.body;
    try {
      const updatedUser = await userDb.updateUser(req.params.id, email, admin);
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: "Failed to update user" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await userDb.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete user" });
    }
  },
};

module.exports = {
  ...userController,
};
