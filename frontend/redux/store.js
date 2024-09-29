import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productSlice';
import categoriesReducer from './slices/categoriesSlice';
import productDetailsReducer from './slices/productDetailsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    productDetails: productDetailsReducer,
  },
});