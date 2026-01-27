import { orderEndpoints } from "./endpoints/orderEndpoints.js";
import api from "./axiosConfig.js";

export const orderApi = {
  getHistory: () => api.get(orderEndpoints.history()),
};
