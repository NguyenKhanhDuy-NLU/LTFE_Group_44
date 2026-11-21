import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";
import accessoryReducer from "./slices/accessorySlice";
import authReducer from "./authSlice";
const store = configureStore({
  reducer: {
    category: categoryReducer,
    cart: cartReducer,
    accessory: accessoryReducer,
    auth: authReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
