import {
  getWalletBalance,
  getTransactionHistory,
} from "../../services/student/walletService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// get wallet balance
export const getWallet = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const balance = await getWalletBalance(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      balance,
    });
  } catch (error) {
    next(error);
  }
};

// get transactions
export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await getTransactionHistory(userId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};
