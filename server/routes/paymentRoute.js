import express from "express";
import {
  createOrder,
  verifyPayment,
  getOrderHistory,
} from "../controllers/students/paymentController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = express.Router();

router.post("/create-order", authenticate, authorize("student"), createOrder);
router.post(
  "/verify-payment",
  authenticate,
  authorize("student"),
  verifyPayment
);
router.get("/orders", authenticate, authorize("student"), getOrderHistory);

export default router;
