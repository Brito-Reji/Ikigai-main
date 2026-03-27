import { configureStore } from "@reduxjs/toolkit";
import studentAuthReducer from "./slices/studentAuthSlice";
import instructorAuthReducer from "./slices/instructorAuthSlice";
import adminAuthReducer from "./slices/adminAuthSlice";
import courseReducer from "./slices/courseSlice";
import cartReducer from "./slices/cartSlice";
import categoryReducer from "./slices/categorySlice";
import chapterReducer from "./slices/chapterSlice";

export const store = configureStore({
  reducer: {
    studentAuth: studentAuthReducer,
    instructorAuth: instructorAuthReducer,
    adminAuth: adminAuthReducer,
    courses: courseReducer,
    cart: cartReducer,
    category: categoryReducer,
    chapters: chapterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
