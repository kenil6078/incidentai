import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        isInitialized: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isInitialized = true;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { setUser, setLoading, setError, clearError } = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
