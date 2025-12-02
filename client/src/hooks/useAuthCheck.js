import { useState, useEffect } from "react";
import api from "@/api/axiosConfig.js";
import { isTokenExpired } from "@/utils/tokenUtils.js";

export const useAuthCheck = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserStatus = async () => {
            const accessToken = localStorage.getItem("accessToken");

            if (!accessToken) {
                setIsLoading(false);
                return;
            }

            const tokenExpired = isTokenExpired(accessToken);

            if (tokenExpired) {
                localStorage.removeItem("accessToken");
                setIsLoading(false);
                return;
            }

            try {
                const userResponse = await api.get("/auth/me");

                if (userResponse.data.user?.isBlocked) {
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                    return;
                }
            } catch (error) {
                if (error.response?.data?.isBlocked) {
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                } else if (error.response?.status === 401) {
                    localStorage.removeItem("accessToken");
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkUserStatus();
    }, []);

    return { isLoading };
};
