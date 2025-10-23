import mongoose from 'mongoose'

export const connectDB = async () => {

    try {
        
        let config = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log("mongodb connected")
    } catch (error) {
        console.error("some error")
    }
}



