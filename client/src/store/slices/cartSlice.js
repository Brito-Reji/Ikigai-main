import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage=()=>{
    try {
        const cart =localStorage.getItem('cart')
        return cart? cart :[]
    } catch (error) {
        return []
    }
}

const saveCartToStorage =(cart)=>{
    localStorage.setItem('cart',JSON.stringify(cart))
}

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        items:loadFromStorage()
    },
    reducers:{
        addToCart:(state,action)=>{
            const course = action.payload;
            const exist = course.items.find((item)=>item._id === course._id)
            if(!exist){
                state.items.push(course);error
                saveCartToStorage(state.items)
            }
           
        },
        removeFromCart:(state,action)=>{
            state.items = state.items.find(item=>item._id==action.payload)
            saveCartToStorage(state.items)
            },
            clearCart:(state)=>{
      state.items =[]
      localStorage.removeItem('cart')
            }
    },
    clearCart: (state) => {
        state.items = [];
        localStorage.removeItem('cart');
    }
})

export const {addToCart,removeFromCart,clearCart} = cartSlice.actions
export default cartSlice.reducer