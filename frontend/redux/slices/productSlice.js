import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts } from "../../utils/api";

export const fetchProductsAsync = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, search, page }) => {
    const response = await fetchProducts({ category, search, page });
    return response;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
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
        if (action.meta.arg.page === 1) {
          state.items = action.payload.products;
        } else {
          state.items = [...state.items, ...action.payload.products];
        }
        state.hasMore = action.payload.products.length > 0;
        state.page = action.meta.arg.page;
        state.noProductsFound = action.payload.products.length === 0 && action.meta.arg.search;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;