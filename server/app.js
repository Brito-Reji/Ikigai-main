import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoute from './routes/auth.js'
import cookieParser from "cookie-parser";
import instructorRoute from './routes/instructorRoute.js'

// import { verifyInstructor } from './middlewares/auth.js'
import adminRoute from './routes/adminRoute.js'
import isAdmin from './middlewares/admin.js';
const app = express()
app.use(express.json())
app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
app.use('/api/auth', authRoute)
app.use('/api/admin',isAdmin, adminRoute)



export default app