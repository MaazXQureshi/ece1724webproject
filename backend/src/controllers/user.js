const userDb = require("../database/user");
const orgDb = require("../database/organizers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userController = {
  // TODO: Need to add better error checking
  registerUser: async (req, res) => {
    const { email, username, password, admin, organizerData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      email,
      username,
      hashedPassword,
      admin,
    };

    try {
      const existingUser = await userDb.findExistingUser(email, username);
      if (existingUser) {
        return res.status(400).json({
          error: "Email or username already exists",
        });
      }
      if (admin) {
        console.log("Org Data to be registered");
        console.log(organizerData);
        const existingOrg = await orgDb.findExistingOrganizer(
          organizerData.name
        );
        console.log(existingOrg);
        if (existingOrg) {
          return res.status(400).json({
            error: "Organizer name already exists",
          });
        }
      }

      // Only create after error checking is done
      const user = await userDb.createUser(userData);
      if (admin) {
        // If the user is an admin, create an organizer and associate the user as the admin
        const organizerDbData = {
          name: organizerData.name,
          info: organizerData.info,
          email: organizerData.email,
          phone: organizerData.phone,
          imageUrl: organizerData.imageUrl,
          adminId: user.id,
        };
        await orgDb.createOrganizer(organizerDbData);
      }
      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      if (error.code === "P2002") {
        return res.status(400).json({
          error:
            "Unique constraint failed. This email or username is already in use.",
        });
      }
      res.status(400).json({ error: "Error creating user" });
    }
  },
  loginUser: async (req, res) => {
    const { email, password } = req.body;
    console.log("Received: ", email, password);
    const user = await userDb.getUserByEmail(email);
    if (!user) console.log("User not found");
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
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000,
        sameSite: "Lax",
      })
      .json({ message: "Login successful", admin: user.admin });
  },
  logoutUser: (req, res) => {
    res.clearCookie("token").json({ message: "Logged out successfully" });
  },
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await userDb.getUserById(userId);
      console.log("in getProfile");
      console.log(user);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json(user);
    } catch {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  },
  getUser: async (req, res) => {
    const user = await userDb.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  },
  updateUser: async (req, res) => {
    const { email, username } = req.body;
    try {
      const updatedUser = await userDb.updateUserById(
        req.params.id,
        email,
        username
      );
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
