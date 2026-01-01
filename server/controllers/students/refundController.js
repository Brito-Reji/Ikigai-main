import * as refundService from "../../services/student/refundService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const fullRefund = async (req, res) => {
  try {
    const { razorpayOrderId, reason } = req.body;
    const userId = req.user._id;

    if (!razorpayOrderId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Razorpay Order ID is required",
      });
    }

    const result = await refundService.processFullRefund({
      razorpayOrderId,
      userId,
      reason,
    });

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    console.error("Full refund error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const partialRefund = async (req, res) => {
  try {
    const { courseId, razorpayOrderId, reason } = req.body;
    const userId = req.user._id;

    if (!courseId || !razorpayOrderId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Course ID and Razorpay Order ID are required",
      });
    }

    const result = await refundService.processPartialRefund({
      courseId,
      userId,
      razorpayOrderId,
      reason,
    });

    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    console.error("Partial refund error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

export const refundHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { razorpayOrderId } = req.query;

    const history = await refundService.getRefundHistory({
      userId,
      razorpayOrderId,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Refund history error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};
