import api from "./axiosConfig";

export const walletApi = {
  getWallet: async () => {
    const response = await api.get("/student/wallet");
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get("/student/wallet/transactions");
    return response.data;
  },
};
