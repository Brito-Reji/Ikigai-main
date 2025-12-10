import { useMemo } from "react";
import {jwtDecode} from "jwt-decode";

export default function useUser() {
    const token = localStorage.getItem("accessToken");

    const user = useMemo(() => {
        if (!token) return null;
        try {
            return jwtDecode(token); 
        } catch {
            return null;
        }
    }, [token]);

    return user;
}
