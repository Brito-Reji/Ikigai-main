import { Wallet, ArrowUpCircle, ArrowDownCircle, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet, useWalletTransactions } from "@/hooks/useWallet";

const WalletCard = () => {
  const navigate = useNavigate();
  const { data: walletData, isLoading: walletLoading } = useWallet();
  const { data: transactionsData, isLoading: transactionsLoading } = useWalletTransactions();

  const balance = walletData?.balance || 0;
  const transactions = transactionsData?.transactions || [];
  const recentTransactions = transactions.slice(0, 3);

  // convert paise to rupees
  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  if (walletLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Wallet Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Wallet Balance</p>
              <p className="text-2xl font-bold text-white">₹{formatAmount(balance)}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/wallet")}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h4>
        
        {transactionsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                }`}>
                  {transaction.type === "credit" ? (
                    <ArrowDownCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowUpCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{transaction.reason}</p>
                  <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                </div>
                <span className={`text-sm font-semibold flex-shrink-0 ${
                  transaction.type === "credit" ? "text-green-600" : "text-red-600"
                }`}>
                  {transaction.type === "credit" ? "+" : "-"}₹{formatAmount(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
