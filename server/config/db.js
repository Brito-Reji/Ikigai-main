import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
  } catch (error) {
    console.error("some error", error);
  }
};
