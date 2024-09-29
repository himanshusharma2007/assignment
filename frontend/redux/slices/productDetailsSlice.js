import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProductById } from "../../utils/api";

export const fetchProductDetailsAsync = createAsyncThunk(
  "productDetails/fetchProductDetails",
  async (id) => {
    const response = await getProductById(id);
    return response;
  }
);

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState: {
    item: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetailsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetailsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
      })
      .addCase(fetchProductDetailsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productDetailsSlice.reducer;
