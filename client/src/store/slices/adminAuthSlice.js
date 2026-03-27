import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../api/adminAxiosConfig.js";

// login
export const loginAdmin = createAsyncThunk(
  "adminAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await adminApi.post("/auth/admin/login", { email, password });
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("adminAccessToken", accessToken);
        if (refreshToken) localStorage.setItem("adminRefreshToken", refreshToken);
        sessionStorage.removeItem("adminRefreshFailed");
        return { user: response.data.user || { email, role: "admin" }, accessToken };
      }
      return rejectWithValue({ message: response.data?.message || "Login failed" });
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || "Login failed" });
    }
  }
);

// fetch current admin
export const fetchCurrentAdmin = createAsyncThunk(
  "adminAuth/fetchCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.get("/auth/me");
      if (response.data.success && response.data.user) {
        return response.data.user;
      }
      return rejectWithValue({ message: "Failed to fetch admin data" });
    } catch (error) {
      return rejectWithValue({ message: "Failed to fetch admin data", shouldRetry: error.response?.status === 401 });
    }
  }
);

const getValidToken = () => {
  const token = localStorage.getItem("adminAccessToken");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

const initialState = {
  user: null,
  accessToken: getValidToken(),
  isAuthenticated: !!getValidToken(),
  loading: false,
  error: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    logoutAdmin: state => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
      adminApi.post("/auth/logout").catch(() => {});
    },
    clearAdminError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginAdmin.pending, state => { state.loading = true; state.error = null; })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      })

      .addCase(fetchCurrentAdmin.pending, state => { state.loading = true; })
      .addCase(fetchCurrentAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentAdmin.rejected, (state, action) => {
        state.loading = false;
        if (!action.payload?.shouldRetry) {
          state.user = null;
          state.isAuthenticated = false;
          state.accessToken = null;
          localStorage.removeItem("adminAccessToken");
        }
      });
  },
});

export const { logoutAdmin, clearAdminError } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
