import axios from "axios";

const API_BASE_URL = "/api";

export const fetchProducts = async ({
  category,
  search,
  page = 1,
  limit = 10,
}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: { category, search, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};
