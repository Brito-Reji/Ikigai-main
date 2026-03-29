import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import api from "@/api/axiosConfig";
import instructorApi from "@/api/instructorAxiosConfig";

const getProfileEndpoint = (role) => {
    return role === 'instructor' ? '/instructor/profile' : '/student/profile'
}

export const useProfile = () => {
    const studentUser = useSelector((state) => state.studentAuth.user);
    const instructorUser = useSelector((state) => state.instructorAuth.user);
    const user = instructorUser || studentUser;
    const endpoint = getProfileEndpoint(user?.role);
    const client = user?.role === "instructor" ? instructorApi : api;

    return useQuery({
        queryKey: ["profile", user?.role],
        queryFn: async () => {
            const { data } = await client.get(endpoint);
            return data;
        },
        enabled: !!user?.role,
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const studentUser = useSelector((state) => state.studentAuth.user);
    const instructorUser = useSelector((state) => state.instructorAuth.user);
    const user = instructorUser || studentUser;
    const endpoint = getProfileEndpoint(user?.role);
    const client = user?.role === "instructor" ? instructorApi : api;

    return useMutation({
        mutationFn: async (profileData) => {
            const { data } = await client.put(endpoint, profileData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile", user?.role] });
        },
    })
}
