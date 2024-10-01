import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProducts } from "../../api";

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async ({ category, search, page, limit }) => {
    const response = await fetchProducts({ category, search, page, limit });
    return response;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    hasMore: true,
    noProductsFound: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.currentPage === 1) {
          state.items = action.payload.products;
        } else {
          state.items = [...state.items, ...action.payload.products];
        }
        state.page = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasMore = state.page < state.totalPages;
        state.noProductsFound =
          action.payload.products.length === 0 && state.page === 1;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
