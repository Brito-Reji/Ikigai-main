import express from 'express'
import cors from 'cors'
import authRoute from './routes/auth.js'
import cookieParser from "cookie-parser";
import instructorRoute  from  './routes/instructorRoute.js'
import { verifyInstructor } from './middlewares/auth.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true, // allow cookies or authorization headers
  })
);
app.use('/api/auth', authRoute)

// Instructor Route

app.use('/api/instructor',verifyInstructor,instructorRoute)



export default app