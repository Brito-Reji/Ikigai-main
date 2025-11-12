import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosConfig";

export const useAvailabilityCheck = (value, field, role = "student", delay = 500) => {
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
       
        if (!value || value.length < 3) {
            setIsAvailable(null);
            setMessage("");
            setIsChecking(false);
            return;
        }

        setIsChecking(true);

        const timeoutId = setTimeout(async () => {
            try {
                const params = { role };
                params[field] = value;

                const response = await api.get("/auth/check-availability", { params });

                if (response.data.success) {
                    setIsAvailable(response.data.available);
                    setMessage(response.data.message);
                }
            } catch (error) {
                console.error("Availability check error:", error);
                setIsAvailable(null);
                setMessage("");
            } finally {
                setIsChecking(false);
            }
        }, delay);

        // Cleanup function
        return () => {
            clearTimeout(timeoutId);
            setIsChecking(false);
        };
    }, [value, field, role, delay]);

    return { isChecking, isAvailable, message };
};
