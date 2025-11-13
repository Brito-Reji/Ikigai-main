import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosConfig";

export const useUsernameCheck = (username, initialValue = "") => {
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Don't check if username is empty or too short
        if (!username || username.trim().length < 3) {
            setIsAvailable(null);
            setMessage("");
            return;
        }

        // Don't check if it's the initial value (for edit forms)
        if (username === initialValue) {
            setIsAvailable(null);
            setMessage("");
            return;
        }

        // Debounce the API call
        const timeoutId = setTimeout(async () => {
            setIsChecking(true);
            try {
                const response = await api.get(`/auth/check-username?username=${encodeURIComponent(username)}`);
                setIsAvailable(response.data.available);
                setMessage(response.data.message);
            } catch (error) {
                console.error("Error checking username:", error);
                setIsAvailable(null);
                setMessage("Error checking username");
            } finally {
                setIsChecking(false);
            }
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timeoutId);
    }, [username, initialValue]);

    return { isChecking, isAvailable, message };
};
