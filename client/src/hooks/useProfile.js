import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import api from '@/api/axiosConfig'

const getProfileEndpoint = (role) => {
    return role === 'instructor' ? '/instructor/profile' : '/student/profile'
}

export const useProfile = () => {
    const user = useSelector((state) => state.auth.user)
    const endpoint = getProfileEndpoint(user?.role)

    return useQuery({
        queryKey: ['profile', user?.role],
        queryFn: async () => {
            const { data } = await api.get(endpoint)
            return data
        },
        enabled: !!user,
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    const user = useSelector((state) => state.auth.user)
    const endpoint = getProfileEndpoint(user?.role)

    return useMutation({
        mutationFn: async (profileData) => {
            const { data } = await api.put(endpoint, profileData)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
    })
}
