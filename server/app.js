import express from "express"
import cors from "cors"
import helmet from "helmet"
import authRoute from "./routes/auth.js"
import cookieParser from "cookie-parser";
import paymentRoute from "./routes/paymentRoute.js"

// import { verifyInstructor } from './middlewares/auth.js'
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import adminRoute from "./routes/adminRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import publicRoute from "./routes/publicRoute.js"
import uploadRoute from "./routes/uploadRoute.js"
import isAdmin from "./middlewares/admin.js";
import isInstructor from "./middlewares/instructor.js"
import isStudent from "./middlewares/student.js"
import instructorRoute from "./routes/instructorRoute.js"
import studentRoute from "./routes/studentRoute.js"


const app = express()
app.use(express.json({ limit: "50mb" }))
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['authorization', 'content-type', 'range'],
  exposedHeaders: ['content-range', 'accept-ranges', 'content-length', 'content-type']
}));

app.use(express.urlencoded({ extended: true, limit: "50mb" }))

app.use(cookieParser())
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use("/api/auth", authRoute)
app.use("/api/categories", categoryRoute)
app.use("/api/public", publicRoute)
app.use("/api/upload", uploadRoute)
app.use("/api/admin", isAdmin, adminRoute)
app.use("/api/instructor", isInstructor, instructorRoute)
app.use("/api/student", isStudent, studentRoute)

// Global error handler

app.use("/api/payment", paymentRoute);
app.use(notFound);
app.use(errorHandler);


export default app