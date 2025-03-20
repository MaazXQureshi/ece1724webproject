const { body, param, validationResult } = require('express-validator');

// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

function isEmpty(str) {
  return !str || str.trim().length === 0;
}

const validateEventData = [
  body('name').notEmpty().withMessage('Event name is required'),
  body('time').isISO8601().withMessage('Invalid date format (use ISO 8601)'),
  body('location').isString().withMessage('Event location is required'),
  body('clubId').isInt().withMessage('Organizer ID must be an integer'),
  body('info').optional().isString().withMessage('Event info must be a string'),
  body('hours').isInt({ min: 0 }).withMessage('Event hours is required'),
  body('imageUrl').optional().isURL().withMessage('Invalid image URL'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateEventQuery = [
  body('name').optional().isString(),
  body('time').optional().isISO8601(),
  body('location').optional().isString(),
  body('hours').optional().isInt({ min: 0 }),
  body('tags').optional().isArray({ min: 0, max: 10 }), // can change max
  body('limit').optional().isInt({ min: 1, max: 100 }),
  body('offset').optional().isInt( { min: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({
        error: "Validation Error",
        message: "Invalid query params"
      });
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
const errorHandler = (err, req, res) => {
  console.error(err);

  return res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
};

module.exports = {
  requestLogger,
  validateResourceId,
  errorHandler,
  validateEventData,
  validateEventQuery
};
