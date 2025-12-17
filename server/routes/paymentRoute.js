import express from "express";
import { createOrder, verifyPayment } from "../controllers/students/paymentController.js";
import isStudent from "../middlewares/student.js";

const router = express.Router();

router.post("/create-order", isStudent, createOrder);
router.post("/verify-payment", isStudent, verifyPayment);

export default router;