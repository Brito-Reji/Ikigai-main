import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morganMiddleware from "./middlewares/morgan.js";

// Routes
import authRoute from "./routes/auth.js";
import adminRoute from "./routes/adminRoute.js";
import instructorRoute from "./routes/instructorRoute.js";
import studentRoute from "./routes/studentRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import publicRoute from "./routes/publicRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

// Middlewares
import authenticate from "./middlewares/authenticate.js";
import authorize from "./middlewares/authorize.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// cors config
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["authorization", "content-type", "range"],
    exposedHeaders: [
      "content-range",
      "accept-ranges",
      "content-length",
      "content-type",
    ],
  })
);

app.use(cookieParser());

// http request logging
app.use(morganMiddleware);

// health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// PUBLIC ROUTES
app.use("/api/auth", authRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/public", publicRoute);
app.use("/api/upload", uploadRoute);

// ADMIN
app.use("/api/admin", authenticate, authorize("admin"), adminRoute);

// INSTRUCTOR
app.use(
  "/api/instructor",
  authenticate,
  authorize("instructor"),
  instructorRoute
);

// STUDENT
app.use("/api/student", authenticate, authorize("student"), studentRoute);

// PAYMENTS (students only)
app.use("/api/payments", authenticate, authorize("student"), paymentRoute);

//ERRORS
app.use(notFound);
app.use(errorHandler);

export default app;
