import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema({
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
        required: [true, "Chapter is required"],
    },
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
        type: Number,
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

lessonSchema.index({ chapter: 1, order: 1 });

export const Lesson = mongoose.model("Lesson", lessonSchema);
