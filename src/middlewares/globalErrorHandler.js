import ErrorStackParser from "error-stack-parser";

/**
 * Middleware for handling errors
 * @param {Error} err - The error object
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 * @param {import("express").NextFunction} next - The next function
 */
const globalErrorHandler = (err, req, res, next) => {
  const errors = {};

  if (err.name === "ValidationError") {
    for (const error of Object.values(err.errors)) {
      errors[error.path] = error.message;
    }
    return res.status(422).json({
      errors: errors,
    });
  }

  if(err.name === 'UnAuthorized') {
    return res.status(401).json({
      errors: {
        message: err.message,
      },
    });
  }

  if (err.name === "NotFound") {
    return res.status(404).json({
      errors: {
        message: err.message,
      },
    });
  }
  return res.status(500).json({
    errors: {
      message: err.message,
      stack: ErrorStackParser.parse(err),
    },
  });
};

export default globalErrorHandler;
