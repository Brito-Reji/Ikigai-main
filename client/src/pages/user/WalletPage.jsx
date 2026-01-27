import { ArrowLeft, Wallet, ArrowUpCircle, ArrowDownCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet, useWalletTransactions } from "@/hooks/useWallet";

const WalletPage = () => {
  const navigate = useNavigate();
  const { data: walletData, isLoading: walletLoading } = useWallet();
  const { data: transactionsData, isLoading: transactionsLoading } = useWalletTransactions();

  const balance = walletData?.balance || 0;
  const transactions = transactionsData?.transactions || [];

  // calculate stats
  const totalCredits = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // convert paise to rupees
  const formatAmount = (amount) => {
    return (amount / 100).toFixed(2);
  };

  if (walletLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-indigo-600" />
            My Wallet
          </h1>
          <p className="text-gray-600 mt-1">View your wallet balance and transactions</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white">
            <p className="text-white/80 text-sm mb-1">Available Balance</p>
            <p className="text-4xl font-bold">₹{formatAmount(balance)}</p>
            <p className="text-white/70 text-sm mt-2">Use for future purchases</p>
          </div>

          {/* Total Credits */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Total Credits</span>
            </div>
            <p className="text-2xl font-bold text-green-600">+₹{formatAmount(totalCredits)}</p>
          </div>

          {/* Total Debits */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm text-gray-500">Total Debits</span>
            </div>
            <p className="text-2xl font-bold text-red-600">-₹{formatAmount(totalDebits)}</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          </div>

          {transactionsLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">Refunds and credits will appear here</p>
            </div>
          ) : (
            <div className="divide-y">
              {transactions.map((transaction) => (
                <div key={transaction._id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    transaction.type === "credit" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {transaction.type === "credit" ? (
                      <ArrowDownCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowUpCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{transaction.reason}</p>
                    <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                  </div>
                  <div className={`text-xl font-bold flex-shrink-0 ${
                    transaction.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}₹{formatAmount(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;

