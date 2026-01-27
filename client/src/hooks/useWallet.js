import { useQuery } from "@tanstack/react-query";
import { walletApi } from "../api/walletApi";

export const useWallet = () => {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: walletApi.getWallet,
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: walletApi.getTransactions,
  });
};
