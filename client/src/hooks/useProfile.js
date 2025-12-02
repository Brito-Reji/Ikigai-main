import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/axiosConfig'

const profileApi = {
    getProfile: async () => {
        const { data } = await api.get('/profile')
        return data
    },

    updateProfile: async (profileData) => {
        const { data } = await api.put('/profile', profileData)
        return data
    },
}

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: profileApi.getProfile,
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: profileApi.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
    })
}
