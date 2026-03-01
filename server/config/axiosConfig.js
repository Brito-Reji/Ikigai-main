import axios from "axios";

const isDev = process.env.NODE_ENV === "development";
console.log("BACKEND_URL", process.env.BACKEND_URL);

const api = axios.create({
  baseURL: (process.env.BACKEND_URL || "http://localhost:3000") + "/api",
  withCredentials: !isDev,
});

export default api;
