import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Lesson title is required"],
        trim: true,
        maxlength: [200, "Lesson title cannot exceed 200 characters"],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Lesson description cannot exceed 1000 characters"],
    },
    videoUrl: {
        type: String,
        trim: true,
    },
    duration: {
        type: Number, // Duration in minutes
        default: 0,
    },
    order: {
        type: Number,
        required: true,
        default: 0,
    },
    isFree: {
        type: Boolean,
        default: false,
    },
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ["pdf", "video", "link", "document", "other"],
            default: "other"
        }
    }]
}, {
    timestamps: true
});

const chapterSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course is required"],
    },
    title: {
        type: String,
        required: [true, "Chapter title is required"],
        trim: true,
        maxlength: [200, "Chapter title cannot exceed 200 characters"],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Chapter description cannot exceed 1000 characters"],
    },
    order: {
        type: Number,
        required: true,
        default: 0,
    },
    lessons: [lessonSchema],
}, {
    timestamps: true
});


chapterSchema.index({ course: 1, order: 1 });

export const Chapter = mongoose.model("Chapter", chapterSchema);
