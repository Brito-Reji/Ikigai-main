import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }],
    },
    { timestamps: true }
);

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
