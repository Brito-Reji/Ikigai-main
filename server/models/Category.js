import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const Category = mongoose.model("Category", categorySchema);

