import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden bg-white shadow animate-pulse h-72" />
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 py-8 px-6 rounded-lg text-center text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">No products found.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="rounded-xl overflow-hidden bg-white group shadow hover:shadow-md transition"
        >
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
            <img
              src={product.images?.[0]?.url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <div className="text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</div>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-bold text-lg text-gray-900">₹{product.price}</span>
            </div>
            {product.colors && product.colors.length > 0 && (
              <div className="flex gap-1 mt-2">
                {product.colors.slice(0, 4).map((color, i) => (
                  <span
                    key={i}
                    className="inline-block w-3 h-3 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-400">+{product.colors.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;