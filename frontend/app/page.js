"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import CategorySelector from "../components/CategorySelector";
import { FaSpinner } from "react-icons/fa";
import { fetchProductsAsync } from "../redux/slices/productSlice";
import { fetchCategoriesAsync } from "../redux/slices/categoriesSlice";

export default function Home() {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
    hasMore,
    page,
    noProductsFound,
  } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchProductsAsync({
        category: selectedCategory,
        search: searchInput,
        page: 1,
      })
    );
  }, [dispatch, selectedCategory, searchInput]);

  const loadMoreProducts = () => {
    if (loading || !hasMore) return;
    dispatch(
      fetchProductsAsync({
        category: selectedCategory,
        search: searchInput,
        page: page + 1,
      })
    );
  };

  const handleSearch = (searchTerm) => {
    setSearchInput(searchTerm);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>ShopSquire</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-6">
        <h1 className="text-4xl font-bold text-center text-red-500">
          ShopSquire
        </h1>
      </header>

      <main>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <SearchBar onSearch={handleSearch} />
          <CategorySelector
            categories={categories}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {noProductsFound ? (
          <div className="text-center text-gray-500">
            Products not found for the search term "{searchInput}"
          </div>
        ) : (
          <>
            <ProductList products={products} />

            {loading && (
              <div className="flex justify-center items-center py-4">
                <FaSpinner className="animate-spin text-4xl text-primary" />
              </div>
            )}

            <div className="text-center mt-8">
              {!hasMore ? (
                <p className="text-gray-500">You reached the end</p>
              ) : (
                <button
                  className="btn bg-blue-500 text-white"
                  onClick={loadMoreProducts}
                  disabled={loading}
                >
                  Load More
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
