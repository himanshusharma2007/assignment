import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategories } from "../../utils/api";

export const fetchCategoriesAsync = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await fetchCategories();
    return response;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categoriesSlice.reducer;