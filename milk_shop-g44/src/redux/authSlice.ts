import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getSession } from "../services/authService";
import type { AuthState, PublicUser } from "../types";
const initialState: AuthState = {
    user: getSession(),
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<PublicUser>) {
            state.user = action.payload;
        },
        logoutSuccess(state) {
            state.user = null;
        },
    },
});
export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
