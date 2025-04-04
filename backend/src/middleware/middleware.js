const { body, param, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const userDb = require("../database/user");
const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

require("dotenv").config();

// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

function isEmpty(str) {
  return !str || str.trim().length === 0;
}

// Configure DigitalOcean Spaces
// const s3 = new S3Client({
//   endpoint: new S3Client.Endpoint(process.env.DO_SPACES_ENDPOINT),
//   accessKeyId: process.env.DO_SPACES_KEY,
//   secretAccessKey: process.env.DO_SPACES_SECRET,
// });

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: process.env.DO_SPACES_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

// Multer setup for file uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.DO_SPACES_NAME,
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});

const validateEventData = [
  body("name").notEmpty().withMessage("Event name is required"),
  body("time").isISO8601().withMessage("Invalid date format (use ISO 8601)"),
  body("location").isString().withMessage("Event location is required"),
  body("clubId").isInt().withMessage("Organizer ID must be an integer"),
  body("info").optional().isString().withMessage("Event info must be a string"),
  body("hours").isInt({ min: 0 }).withMessage("Event hours is required"),
  body("imageUrl").optional().isURL().withMessage("Invalid image URL"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateEventQuery = [
  body("name").optional().isString(),
  body("time").optional().isISO8601(),
  body("location").optional().isString(),
  body("hours").optional().isInt({ min: 0 }),
  body("tags").optional().isArray({ min: 0, max: 10 }), // can change max
  body("limit").optional().isInt({ min: 1, max: 100 }),
  body("offset").optional().isInt({ min: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        error: "Validation Error",
        message: "Invalid query params",
      });
    }
    next();
  },
];

const validateTagQuery = [
  body("name").optional().isString(),
  body("limit").optional().isInt({ min: 1, max: 100 }),
  body("offset").optional().isInt({ min: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        error: "Validation Error",
        message: "Invalid query params",
      });
    }
    next();
  },
];

const validateOrganizerData = [
  body("name").notEmpty().withMessage("Organizer name is required"),
  body("info").optional().isString().withMessage("Event info must be a string"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
  body("imageUrl").optional().isURL().withMessage("Invalid image URL"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validate resource ID parameter
const validateResourceId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Invalid ID format",
    });
  }

  next();
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.log("In error handler");
  console.error(err);

  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Middleware for admin access to specific routes
const authorizeOrganizerAdmin = async (req, res, next) => {
  const userId = req.user.id;
  const organizerId = parseInt(req.params.id);

  const user = await userDb.getUserById(userId);

  console.log("In authorizeOrganizerAdmin middleware");
  console.log("organizer ID: ", organizerId);
  console.log(user);
  console.log("user's organizer ID: ", user.organizer.id);

  if (!user.admin || !user.organizer || user.organizer.id !== organizerId) {
    return res
      .status(403)
      .json({ error: "Forbidden: You are not the admin of this organizer" });
  }

  next();
};

const authorizeUser = (req, res, next) => {
  const userId = req.user.id;
  console.log("In authorizeUser middleware");
  console.log(req.user);
  const requestedUserId = parseInt(req.params.id);

  if (userId !== requestedUserId) {
    return res
      .status(403)
      .json({ error: "Forbidden: You can only edit your own profile" });
  }
  console.log("User is authorized to edit own profile");
  next();
};

// Example Usage:
/*
app.get('/edit/:id', authenticate, authorizeAdminForRoute, (req, res) => {
  res.json({ message: `Admin ${req.user.id} has access to edit page ${req.params.id}` });
});
*/

module.exports = {
  requestLogger,
  validateResourceId,
  errorHandler,
  validateEventData,
  validateTagQuery,
  validateEventQuery,
  validateOrganizerData,
  authenticate,
  authorizeOrganizerAdmin,
  authorizeUser,
  upload: upload.single("image"),
};
