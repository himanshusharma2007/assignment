"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  // Ensure router.query exists before destructuring
  const { category = null, search = "" } = router.query || {};

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts({ category, search, page: 1 }),
          fetchCategories(),
        ]);
        setProducts(productsData.products);
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [category, search]);

  const loadMoreProducts = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const nextPage = page + 1;
      const newProducts = await fetchProducts({
        category,
        search,
        page: nextPage,
      });
      setProducts((prevProducts) => [...prevProducts, ...newProducts.products]);
      setPage(nextPage);
    } catch (err) {
      setError("Failed to load more products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    router.push({
      pathname: "/",
      query: { ...router.query, search: searchTerm },
    });
  };

  const handleCategoryChange = (selectedCategory) => {
    router.push({
      pathname: "/",
      query: { ...router.query, category: selectedCategory },
    });
  };

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>ShopSquire</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-6">
        <h1 className="text-4xl font-bold text-center text-red-500">ShopSquire</h1>
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

        <ProductList products={products} />

        {loading && (
          <div className="flex justify-center items-center py-4">
            <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
        )}

        <div className="text-center mt-8">
          <button
            className="btn btn-primary"
            onClick={loadMoreProducts}
            disabled={loading}
          >
            Load More
          </button>
        </div>
      </main>
    </div>
  );
}
