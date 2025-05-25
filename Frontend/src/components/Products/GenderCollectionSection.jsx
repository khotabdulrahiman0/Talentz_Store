import React from 'react';
import menCollectionImage from "../../assets/mens-collection.webp";
import womenCollectionImage from "../../assets/womens-collection.webp";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'react-feather';

const GenderCollectionSection = () => {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop By Category</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Explore our curated collections for both men and women, featuring the latest trends and timeless classics.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Women's Collection */}
          <div className="group relative overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src={womenCollectionImage} 
                alt="Women's Collection" 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white/80 text-sm tracking-wider uppercase mb-2 block">
                  New Season
                </span>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Women's Collection
                </h3>
                <Link 
                  to="/collections/all?gender=Women"
                  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 group/btn"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Men's Collection */}
          <div className="group relative overflow-hidden">
            <div className="aspect-[3/4] overflow-hidden">
              <img 
                src={menCollectionImage} 
                alt="Men's Collection" 
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white/80 text-sm tracking-wider uppercase mb-2 block">
                  Latest Styles
                </span>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Men's Collection
                </h3>
                <Link 
                  to="/collections/all?gender=Men"
                  className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-300 group/btn"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <p className="font-medium mb-1">Free Shipping</p>
            <p className="text-sm text-neutral-600">On orders over ₹499</p>
          </div>
          <div>
            <p className="font-medium mb-1">Secure Payment</p>
            <p className="text-sm text-neutral-600">100% secure checkout</p>
          </div>
          <div>
            <p className="font-medium mb-1">Free Returns</p>
            <p className="text-sm text-neutral-600">7-day return policy</p>
          </div>
          <div>
            <p className="font-medium mb-1">Customer Support</p>
            <p className="text-sm text-neutral-600">24/7 assistance</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;