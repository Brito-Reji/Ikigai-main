import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Category is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  overview: {
    type: String,
    required: [true, 'Overview is required'],
    trim: true,
    maxlength: [1000, 'Overview cannot exceed 1000 characters'],
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instructor',
    required: [true, 'Instructor is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  published: {
    type: Boolean,
    default: false,
  },

  blocked: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
  },
  thumbnail: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true
});

export const Course = mongoose.model('Course', courseSchema);
