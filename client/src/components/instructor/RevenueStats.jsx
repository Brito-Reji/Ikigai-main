import React from "react";
import { TrendingUp, DollarSign, Clock, AlertTriangle } from "lucide-react";

export default function RevenueStats({ stats, loading }) {
  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Available Balance",
      value: formatCurrency(stats.releasedFunds),
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      subtitle: "Ready to withdraw",
    },
    {
      title: "Held in Escrow",
      value: formatCurrency(stats.heldFunds),
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
      subtitle: "7-day hold period",
    },
    {
      title: "Refunded",
      value: formatCurrency(stats.refundedAmount),
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">{card.title}</span>
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          {card.subtitle && (
            <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}
