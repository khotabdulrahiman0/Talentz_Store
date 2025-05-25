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
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
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
            className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading ? (
              [...Array(4)].map((_, index) => (
                <div key={index} className="min-w-[300px] animate-pulse">
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
                  className="min-w-[300px] group shadow-md hover:shadow-lg rounded-lg overflow-hidden bg-white"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <img 
                      src={product.images?.[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-md font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-md text-gray-600 font-medium">
                    ₹{product.price}
                    </p>
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
        `}
      </style>
    </section>
  );
};

export default NewArrivals;