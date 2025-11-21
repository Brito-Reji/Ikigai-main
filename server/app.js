import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoute from './routes/auth.js'
import cookieParser from "cookie-parser";


// import { verifyInstructor } from './middlewares/auth.js'
import adminRoute from './routes/adminRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import isAdmin from './middlewares/admin.js';
import isInstructor from './middlewares/instructor.js'
import instructorRoute from './routes/instructorRoute.js'
import { logger } from './utils/logger.js';
const app = express()
app.use(express.json({ limit: '50mb' })) // Increase JSON payload limit for image uploads
app.use(helmet());
app.use(logger);
app.use(express.urlencoded({ extended: true, limit: '50mb' })) // Increase URL encoded payload limit

app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use('/api/auth', authRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/admin', isAdmin, adminRoute)
app.use('/api/instructor', isInstructor, instructorRoute)



export default app