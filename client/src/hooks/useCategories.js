import { useQuery } from '@tanstack/react-query'
import api from '@/api/axiosConfig'

const categoryApi = {
    getCategories: async (params) => {
        const { data } = await api.get('/public', { params })
        return data
    },
}

export const useCategories = (params) => {
    return useQuery({
        queryKey: ['categories', params],
        queryFn: () => categoryApi.getCategories(params),
    })
}
