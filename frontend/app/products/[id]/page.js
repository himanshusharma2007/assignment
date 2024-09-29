"use client"; // Mark this component as a Client Component

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import Head from "next/head";
import Image from "next/image";
import { FaArrowLeft, FaStar, FaSpinner } from "react-icons/fa";
import { getProductById } from "../../../utils/api";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true); // New loading state for images
  const router = useRouter();
  const { id } =useParams();

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!product) {
    return <div className="alert alert-info">No product found</div>;
  }

  return (
    <div className="container mx-auto px-4 ">
       <header className="py-6">
        <h1 className="text-4xl font-bold text-center text-red-500">
          ShopSquire
        </h1>
      </header>
      <button
        onClick={handleGoBack}
        className="btn btn-ghost btn-circle absolute top-4 left-4"
      >
        <FaArrowLeft className="text-xl" />
      </button>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-center  min-h-screen">
        <div className="md:w-1/2">
          <div className="relative h-96 w-full">
            {imageLoading && (
              <div className="absolute inset-0 flex justify-center items-center bg-gray-200">
                <FaSpinner className="animate-spin text-4xl text-primary" />
              </div>
            )}
            <Image
              src={product.images[currentImageIndex]}
              alt={product.title}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
              onLoad={() => setImageLoading(false)} // Set loading to false when the image loads
              onError={() => setImageLoading(false)} // Also set to false if there's an error
            />
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost"
            >
              ❮
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost"
            >
              ❯
            </button>
          </div>
          <div className="flex mt-4 gap-2 overflow-x-auto">
            {product.images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${product.title} - ${index + 1}`}
                width={80}
                height={80}
                objectFit="cover"
                className={`rounded cursor-pointer ${
                  index === currentImageIndex ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-xl font-semibold text-primary mb-4">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`${
                  i < Math.round(product.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                } mr-1`}
              />
            ))}
            <span className="text-sm ml-2">{product.rating} out of 5</span>
          </div>
          <p className="mb-4">{product.description}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="badge badge-outline">{product.brand}</div>
            <div className="badge badge-outline">{product.category}</div>
          </div>
          <button className="btn btn-primary w-full">Add to Cart</button>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">{review.title}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } mr-1`}
                      />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                  <div className="text-sm text-gray-500">
                    By {review.author} on{" "}
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
