import express from "express";
import {
  createOrder,
  verifyPayment,
  getOrderHistory,
  retryOrder,
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
router.post("/retry-order", authenticate, authorize("student"), retryOrder);
router.get("/orders", authenticate, authorize("student"), getOrderHistory);

export default router;
