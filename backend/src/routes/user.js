const express = require("express");
const router = express.Router();
const controller = require("../controllers/user");
const db = require("../database/user");
const middleware = require("../middleware/middleware");
const { authenticate } = require("../middleware/middleware");

// POST /user/register - Register a new user.
// POST /user/login - Authenticate a user and return a JWT session token.
// POST /user/logout - Logout user by clearing the JWT session token
// GET /user/:id - Fetch a specific user by ID.
// PUT /user/:id - Update a user.
// DELETE /user/:id - Delete a user.

router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/logout", controller.logoutUser);

// Protected Routes
router.get("/profile", authenticate, controller.getProfile);
router.get("/:id", authenticate, controller.getUser);
router.put("/:id", authenticate, controller.updateUser);
router.delete("/:id", authenticate, controller.deleteUser);

module.exports = router;
