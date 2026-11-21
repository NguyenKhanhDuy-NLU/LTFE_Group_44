import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AddToCartPayload, CartState } from "../../types";
const initialState: CartState = {
  items: [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<string>) {
      const productId = action.payload;
      const item = state.items.find((cartItem) => cartItem.productId === productId);
      if (item) {
        item.quantity = item.quantity + 1;
      } else {
        state.items.push({ productId: productId, quantity: 1 });
      }
    },
    addToCartQuantity(state, action: PayloadAction<AddToCartPayload>) {
      const { productId, quantity } = action.payload;
      if (quantity < 1) {
        return;
      }
      const item = state.items.find((cartItem) => cartItem.productId === productId);
      if (item) {
        item.quantity = item.quantity + quantity;
      } else {
        state.items.push({ productId: productId, quantity: quantity });
      }
    },
  },
});
export const { addToCart, addToCartQuantity } = cartSlice.actions;
export default cartSlice.reducer;
