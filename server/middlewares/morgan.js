import morgan from "morgan";
import logger from "../utils/logger.js";

const isProd = process.env.NODE_ENV === "production";

// custom tokens
morgan.token("user-id", (req) => {
  return req.user?.id || "guest";
});

morgan.token("user-role", (req) => {
  return req.user?.role || "guest";
});

morgan.token("response-time-ms", (req, res) => {
  const responseTime = res.getHeader("X-Response-Time");
  return responseTime ? `${responseTime}ms` : "-";
});

// dev format
const devFormat = ":method :url :status :response-time ms - :res[content-length]";

// combined format
const combinedFormat =
  ":remote-addr - :user-id [:user-role] [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\"";

// morgan middleware
const morganMiddleware = morgan(
  isProd ? combinedFormat : devFormat,
  {
    stream: logger.stream,
    skip: (req) => {
      // skip health checks
      return req.url === "/health" || req.url === "/api/health";
    },
  }
);

export default morganMiddleware;
