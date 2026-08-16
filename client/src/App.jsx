import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import LoadingScreen from "@/components/common/LoadingScreen.jsx";
import { useAuthCheck } from "./hooks/useAuthCheck.js";
import SocketProvider from "@/context/SocketProvider";
import { PendingPaymentProvider } from "./context/PendingPaymentProvider";
import ScrollToTop from "./components/layout/ScrollToTop.jsx";
import api from "@/api/axiosConfig.js";

const VISIT_PING_KEY = "ikigai_visit_pinged";

function pingVisit(path) {
  if (sessionStorage.getItem(VISIT_PING_KEY)) {
    return;
  }

  sessionStorage.setItem(VISIT_PING_KEY, "1");

  api
    .post("/public/visit", {
      path,
      referrer: document.referrer || "",
    })
    .catch(() => {});
}

function App() {
  const location = useLocation();
  const { isLoading } = useAuthCheck();

  useEffect(() => {
    pingVisit(location.pathname);
  }, [location.pathname]);

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
      <PendingPaymentProvider>
        <div>
          <Toaster position="top-center" />
          <ScrollToTop />

          <AppRoutes />
        </div>
      </PendingPaymentProvider>
    </SocketProvider>
  );
}

export default App;

