import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import cartReducer from './slices/cartSlice';
import categoryReducer from './slices/categorySlice';
import chapterReducer from './slices/chapterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    course: courseReducer, // For instructor course management
    cart: cartReducer,
    category: categoryReducer,
    chapters: chapterReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
