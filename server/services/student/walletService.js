import { Wallet } from "../../models/Wallet.js";
import { WalletTransaction } from "../../models/WalletTransaction.js";

// get or create wallet
export const getOrCreateWallet = async userId => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({ userId, balance: 0 });
  }
  return wallet;
};

// credit wallet
export const creditWallet = async ({
  userId,
  amount,
  reason,
  relatedPaymentId = null,
  relatedOrderId = null,
}) => {
  const wallet = await getOrCreateWallet(userId);

  wallet.balance += amount;
  await wallet.save();

  const transaction = await WalletTransaction.create({
    walletId: wallet._id,
    userId,
    type: "credit",
    amount,
    reason,
    relatedPaymentId,
    relatedOrderId,
  });

  return { wallet, transaction };
};

// debit wallet
export const debitWallet = async ({ userId, amount, reason }) => {
  const wallet = await getOrCreateWallet(userId);

  if (wallet.balance < amount) {
    throw new Error("Insufficient wallet balance");
  }

  wallet.balance -= amount;
  await wallet.save();

  const transaction = await WalletTransaction.create({
    walletId: wallet._id,
    userId,
    type: "debit",
    amount,
    reason,
  });

  return { wallet, transaction };
};

// get wallet balance
export const getWalletBalance = async userId => {
  const wallet = await getOrCreateWallet(userId);
  return wallet.balance;
};

// get transaction history
export const getTransactionHistory = async (userId, limit = 50) => {
  const transactions = await WalletTransaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("relatedPaymentId", "courseId amount")
    .populate("relatedOrderId", "razorpayOrderId amount");

  return transactions;
};
