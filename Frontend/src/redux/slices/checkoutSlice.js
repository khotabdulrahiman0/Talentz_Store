import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// async thunk to create a checkout session
export const createCheckout = createAsyncThunk("checkout/createCheckout",async (checkoutData, {rejectWithValue}) =>{
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`,checkoutData,
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createRazorpayOrder = createAsyncThunk("checkout/createRazorpayOrder", async (checkoutId, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/razorpay-order`,
            {},
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// **🔹 Confirm Payment**
export const confirmPayment = createAsyncThunk("checkout/confirmPayment", async ({ checkoutId, paymentDetails }, { rejectWithValue }) => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
            {
                paymentStatus: "paid",
                paymentDetails,
            },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});



const checkoutSlice = createSlice({
    name:"checkout",
    initialState:{
        checkout:null,
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(createCheckout.pending, (state)=>{
            state.loading = true,
            state.error = null
        })
        .addCase(createCheckout.fulfilled, (state,action)=>{
            state.loading = false,
            state.checkout = action.payload; 
        })
        .addCase(createCheckout.rejected, (state, action)=>{
            state.loading = false,
            state.error = action.payload.message;
        })
        .addCase(createRazorpayOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createRazorpayOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.razorpayOrder = action.payload;
        })
        .addCase(createRazorpayOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        .addCase(confirmPayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(confirmPayment.fulfilled, (state, action) => {
            state.loading = false;
            state.checkout = action.payload;
        })
        .addCase(confirmPayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    }
})

export default checkoutSlice.reducer;