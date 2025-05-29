import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        setNewArrivals(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      updateScrollButtons();
    }

    return () => {
      if (container) container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [newArrivals]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Latest Collection</span>
            <h2 className="text-3xl font-bold text-gray-800">New Arrivals</h2>
          </div>
          <Link to="/collections/all" className="text-sm font-medium mt-2 md:mt-0 text-indigo-600 hover:underline">
            View All Products →
          </Link>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-5 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white shadow-md rounded-full z-10 hover:scale-110 transition"
            >
              <ChevronLeft className="w-8 h-8 text-gray-700" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="flex-shrink-0 w-72 animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3" />
                  <div className="h-4 bg-gray-300 w-2/3 mb-2 rounded" />
                  <div className="h-4 bg-gray-300 w-1/3 rounded" />
                </div>
              ))
            ) : (
              newArrivals.map((product) => (
                <Link
                  key={product._id}
                  to={`/product/${product._id}`}
                  className="flex-shrink-0 w-72 group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img 
                      src={product.images?.[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Optional: Add a "New" badge */}
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      NEW
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{product.price}
                      </p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice}
                        </p>
                      )}
                    </div>
                    {/* Optional: Add rating or other product info */}
                    {/* {product.rating && (
                      <div className="flex items-center mt-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(product.rating) ? "★" : "☆"}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">({product.reviewCount || 0})</span>
                      </div>
                    )} */}
                  </div>
                </Link>
              ))
            )}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-5 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-white shadow-md rounded-full z-10 hover:scale-110 transition"
            >
              <ChevronRight className="w-8 h-8 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}
      </style>
    </section>
  );
};

export default NewArrivals;