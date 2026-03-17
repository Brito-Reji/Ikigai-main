import express from "express";
import {
  createOrder,
  verifyPayment,
  getOrderHistory,
  retryOrder,
  getPendingPayment,
  cancelOrder,
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
router.get("/orders/pending", authenticate, authorize("student"), getPendingPayment);
router.put("/orders/cancel", authenticate, authorize("student"), cancelOrder);

export default router;
