import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingBag } from 'react-feather';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="w-full h-80 bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div key={index} className="group relative">
          <Link to={`/product/${product._id}`} className="block">
            <div className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg">
              {/* Image Container */}
              <div className="relative w-full h-80 mb-4 overflow-hidden rounded-lg">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={product.images[0]?.url}
                  alt={product.name}
                />
                
                {/* Discount Badge */}
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}

                {/* Quick Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                  </button>
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                  {product.name}
                </h3>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                  ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Color Variants */}
                {product.colors && (
                  <div className="flex gap-1 mt-2">
                    {product.colors.slice(0, 4).map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Add Button */}
              <button className="w-full mt-4 py-2 bg-black text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                Quick Add
              </button>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;