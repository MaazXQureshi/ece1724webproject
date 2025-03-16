// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

function isEmpty(str) {
  return !str || str.trim().length === 0;
}

// Validate resource ID parameter
const validateResourceId = (req, res, next) => {
  // TODO: Implement ID validation
  //
  // If ID is invalid, return:
  // Status: 400
  // {
  //   "error": "Validation Error",
  //   "message": "Invalid ID format"
  // }
  //
  // If valid, call next()

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
};
