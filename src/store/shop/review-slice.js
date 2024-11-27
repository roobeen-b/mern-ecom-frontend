import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productReviews: [],
};

export const addNewReview = createAsyncThunk(
  "/shop/addNewReview",
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
      formData
    );
    return response?.data;
  }
);

export const getProductReviews = createAsyncThunk(
  "/shop/getProductReviews",
  async (productId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/review/get/${productId}`
    );
    return response?.data;
  }
);

const reviewSlice = createSlice({
  name: "productReview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewReview.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewReview.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getProductReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productReviews = action.payload.data;
      })
      .addCase(getProductReviews.rejected, (state) => {
        state.isLoading = false;
        state.productReviews = [];
      });
  },
});

export default reviewSlice.reducer;
