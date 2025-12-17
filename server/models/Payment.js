import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        courseIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
                required: true,
            },
        ],

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "INR",
        },

        razorpayOrderId: {
            type: String,
        },

        razorpayPaymentId: {
            type: String,
        },

        razorpaySignature: {
            type: String,
        },

        status: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
            default: "PENDING",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Payment = mongoose.model("Payment", paymentSchema);
