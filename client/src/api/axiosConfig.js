import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  let accessToken = localStorage.getItem("accessToken")

  // Handle case where token might be stored as JSON object
  if (accessToken) {
    try {
      // Try to parse as JSON in case it was stored incorrectly
      const parsed = JSON.parse(accessToken)
      if (parsed.accessToken) {
        // If it's an object with accessToken property, extract it
        accessToken = parsed.accessToken
        // Fix the storage
        localStorage.setItem("accessToken", accessToken)
      }
    } catch (e) {
      // Not JSON, use as is (this is the correct case)
      console.log(e)
    }

    config.headers.Authorization = `Bearer ${accessToken}`
    console.log("Adding token to request:", accessToken)
  } else {
    console.log("No token found in localStorage")
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    console.log("Response error:", error.response?.status, error.config?.url)

    // Don't try to refresh if it's the refresh endpoint itself that failed
    if (originalRequest.url?.includes("/auth/refresh")) {
      console.log("Refresh endpoint failed, not retrying")
      return Promise.reject(error)
    }

    // Check if error.response exists to avoid crashes
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      console.log("Attempting to refresh token")

      try {
        const response = await api.post("/auth/refresh")
        if (response.data.success && response.data.accessToken) {
          const { accessToken } = response.data
          localStorage.setItem("accessToken", accessToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          console.log("Token refreshed successfully")
          return api(originalRequest) // retry the original request
        }
      } catch (err) {
        console.log("Refresh failed:", err.message)
        localStorage.removeItem("accessToken")
        // Don't reject if it's just an invalid/missing refresh token on login page
        if (window.location.pathname.includes('/login')) {
          return Promise.reject({ ...err, silent: true })
        }
        return Promise.reject(err)
      }
    }

    // If user is blocked, clear token
    if (error.response?.data?.isBlocked) {
      console.log("User is blocked, clearing token")
      localStorage.removeItem("accessToken")
    }

    return Promise.reject(error)
  },
)

export default api
