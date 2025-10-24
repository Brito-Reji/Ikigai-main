import express from 'express'
import authRoute from './routes/auth.js'
import instructorRoute  from  './routes/instructorRoute.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use('/api/auth', authRoute)

// insTruvtor Route

app.use('/api/instructor',instructorRoute)



export default app