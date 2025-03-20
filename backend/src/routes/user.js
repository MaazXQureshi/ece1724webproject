const express = require("express");
const router = express.Router();
const db = require("../database/events");
const middleware = require("../middleware/middleware");

// POST /user/register - Register a new user.
// POST /user/login - Authenticate a user and return a JWT session token.
// POST /user/logout - Logout user by clearing the JWT session token
// GET /user/:id - Fetch a specific user by ID.
// PUT /user/:id - Update a user.
// DELETE /user/:id - Delete a user.


module.exports = router;
