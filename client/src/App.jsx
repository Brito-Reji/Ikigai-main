import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import LoadingScreen from "./components/LoadingScreen.jsx";
import { useAuthCheck } from "./hooks/useAuthCheck.js";

function App() {
  const location = useLocation();
  const { isLoading } = useAuthCheck();

  useEffect(() => {
    if (location.pathname !== "/verify-otp") {
      localStorage.removeItem("otpExpiry");
    }
  }, [location.pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <Toaster position="top-right" />
      <AppRoutes />
    </div>
  );
}

export default App;
