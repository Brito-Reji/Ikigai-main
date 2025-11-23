import api from "@/api/axiosConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, thunkAPI) => {
        try {
            const res = await api.get('/public')
            console.log('category thunk ->', res)
            return res.data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)


export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (category, thunkAPI) => {
        try {
            const res = await api.post('/categories', category)
            return res.data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)
export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async (category, thunkAPI) => {
        try {
            const res = await api.put(`/categories/${category._id}`, category)
            return res.data
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)
export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (_id, thunkAPI) => {
        try {
            await api.patch(`/categories/${_id}`)
            return _id
        } catch (err) {
            return thunkAPI.rejectWithValue(err.message)
        }
    }
)


const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload.categories
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createCategory.pending, (state) => {
                state.loading = true
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false
                state.categories.push(action.payload.category)
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateCategory.pending, (state) => {
                state.loading = true
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false
                state.categories = state.categories.map((category) => category._id === action.payload._id ? action.payload : category)
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false
                state.categories = state.categories.filter((category) => category._id !== action.payload._id)
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default categorySlice.reducer