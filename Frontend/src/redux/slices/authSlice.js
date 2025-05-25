import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Retrieve user info and token from localStorage if available
const userFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

// Check for an existing guest ID in localStorage or generate a new one
const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

// Initial state
const initialState = {
    user: userFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
    pendingVerification: false,
    pendingEmail: null
};

// Async Thunk for User Login
export const loginUser = createAsyncThunk("auth/loginUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", response.data.token);

        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Async Thunk for User Register (keeping for compatibility)
export const registerUser = createAsyncThunk("auth/registerUser", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", response.data.token);

        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// Async Thunk for OTP Request
export const registerRequestOTP = createAsyncThunk(
    "auth/registerRequestOTP", 
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register/request-otp`, 
                { email }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for OTP Verification and Registration
export const registerVerifyOTP = createAsyncThunk(
    "auth/registerVerifyOTP",
    async ({ email, otp, name, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register/verify`,
                { email, otp, name, password }
            );
            
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);
            
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk for Resending OTP
export const resendOTP = createAsyncThunk(
    "auth/resendOTP",
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/register/resend-otp`,
                { email }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`; // Reset guest ID on logout
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId); // Set new guest ID in localStorage
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            
            // Register cases (original)
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            
            // Request OTP cases
            .addCase(registerRequestOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerRequestOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingVerification = true;
                state.pendingEmail = action.payload.email;
            })
            .addCase(registerRequestOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.msg || "Failed to send verification code";
            })
            
            // Verify OTP cases
            .addCase(registerVerifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerVerifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.pendingVerification = false;
                state.pendingEmail = null;
            })
            .addCase(registerVerifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.msg || "Verification failed";
            })
            
            // Resend OTP cases
            .addCase(resendOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendOTP.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resendOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.msg || "Failed to resend verification code";
            });
    },
});

export const { logout, generateNewGuestId, clearError } = authSlice.actions;
export default authSlice.reducer;