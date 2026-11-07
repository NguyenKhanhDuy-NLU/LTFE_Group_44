import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getSession } from "../services/authService";
import type { PublicUser } from "../services/authService";

export interface AuthState {
    user: PublicUser | null;
}

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

export const selectCurrentUser = (state: { auth: AuthState }) =>
    state.auth.user;

export default authSlice.reducer;
