"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import CategorySelector from "../components/CategorySelector";
import { fetchProducts, fetchCategories } from "../utils/api";
import { FaSpinner } from "react-icons/fa";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(""); // State for search input
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [hasMore, setHasMore] = useState(true); // Track if more products can be loaded
  const [noProductsFound, setNoProductsFound] = useState(false); // New state for search result


  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setNoProductsFound(false); // Reset the "no products found" state
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts({
            category: selectedCategory,
            search: searchInput,
            page: 1,
          }),
          fetchCategories(),
        ]);
        setProducts(productsData.products);
        setCategories(categoriesData);
        setPage(1); // Reset to the first page on new search or category selection
        setHasMore(productsData.products.length > 0); // If no products, disable loading more

        // If no products are found for the search, set `noProductsFound` to true
        if (productsData.products.length === 0 && searchInput) {
          setNoProductsFound(true);
        }
      } catch (err) {
        setError("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [selectedCategory, searchInput]); // Watch both search input and category for changes

  const loadMoreProducts = async () => {
    if (loading || !hasMore) return; // Prevent loading more if already loading or no more products

    try {
      setLoading(true);
      const nextPage = page + 1;
      const newProducts = await fetchProducts({
        category: selectedCategory,
        search: searchInput,
        page: nextPage,
      });

      if (newProducts.products.length === 0) {
        setHasMore(false); // No more products to load
      } else {
        setProducts((prevProducts) => [
          ...prevProducts,
          ...newProducts.products,
        ]);
        setPage(nextPage);
      }
    } catch (err) {
      setError("Failed to load more products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchInput(searchTerm); // Update search input state
  };

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category); // Update selected category state
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
