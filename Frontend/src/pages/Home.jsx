import React, { useEffect, useState } from 'react';
import { Award, TrendingUp } from 'react-feather';
import Hero from '../components/Layout/Hero';
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturesSection from '../components/Products/FeaturesSection';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productSlice';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);

  useEffect(() => {
    // Fetch ALL products (remove specific filters to get all products)
    dispatch(
      fetchProductsByFilters({
        limit: 12, // You can adjust this number based on how many products you want to show
      })
    );

    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        console.log('Best Seller Response:', response.data);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error('Error fetching best seller:', error);
      } finally {
        setBestSellerLoading(false);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Sellers Section */}
      <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 py-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"></div>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Award className="w-8 h-8 text-yellow-500" strokeWidth={1.5} />
            <h2 className="text-3xl font-bold text-center">Best Seller</h2>
            <TrendingUp className="w-8 h-8 text-yellow-500" strokeWidth={1.5} />
          </div>
          
          {bestSellerLoading ? (
            <div className="w-full flex items-center justify-center p-12">
              <div className="animate-pulse space-y-4">
                <div className="h-48 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ) : bestSellerProduct ? (
            <ProductDetails productId={bestSellerProduct._id} />
          ) : (
            <p className="text-center text-gray-600">No best seller product found.</p>
          )}
        </div>
      </div>

      {/* All Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-center">Featured Products</h2>
        </div>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      {/* <FeaturesSection /> */}
    </div>
  );
};

export default Home;