import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = () => {
    try {
        const cart = localStorage.getItem("cart");
        return cart ? JSON.parse(cart) : [];
    } catch (error) {
        console.error("Error loading cart from storage:", error);
        return [];
    }
};

const saveCartToStorage = (cart) => {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart to storage:", error);
    }
};

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: loadFromStorage()
    },
    reducers: {
        addToCart: (state, action) => {
            const course = action.payload;
            const existingItem = state.items.find((item) => item._id === course._id);

            if (!existingItem) {
                state.items.push(course);
                saveCartToStorage(state.items);
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
            saveCartToStorage(state.items);
        },
        setCart: (state, action) => {
            state.items = action.payload;
            saveCartToStorage(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("cart");
        }
    }
});

export const { addToCart, removeFromCart, setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;