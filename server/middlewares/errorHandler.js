import logger from "../utils/logger.js";

// Global error handler
export const errorHandler = (err, req, res, next) => {
  // pick status from error, or from res if set before throw
  const resCode = res.statusCode !== 200 ? res.statusCode : null;
  const statusCode = err.statusCode || err.status || resCode || 500;

  const message = err.message || "Internal Server Error";

  logger.error(
    `${statusCode} - ${message} - ${req.originalUrl} - ${req.method}`
  );

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// 404 handler
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
