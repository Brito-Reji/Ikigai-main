import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import LoadingScreen from "@/components/common/LoadingScreen.jsx";
import { useAuthCheck } from "./hooks/useAuthCheck.js";
import SocketProvider from "@/context/SocketProvider";

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
    <SocketProvider>
      <div>
        <Toaster position="top-center" />
        <AppRoutes />
      </div>
    </SocketProvider>
  );
}

export default App;

