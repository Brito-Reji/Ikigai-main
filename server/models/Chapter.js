import mongoose from "mongoose";

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
}, {
    timestamps: true
});

chapterSchema.index({ course: 1, order: 1 });

export const Chapter = mongoose.model("Chapter", chapterSchema);
