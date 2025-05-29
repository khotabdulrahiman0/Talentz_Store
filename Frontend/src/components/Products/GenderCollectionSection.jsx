import React from 'react';
import purseImage from "../../assets/purse.jpg";
import necklaceImage from "../../assets/necklce.jpg";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'react-feather';

const GenderCollectionSection = () => {
  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Featured Categories</h2>
          <p className="text-neutral-600 max-w-md mx-auto text-base">
            Shop stylish purses and elegant necklaces crafted for modern fashion.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Necklace */}
          <div className="group relative overflow-hidden rounded-lg shadow-md">
            <div className="aspect-[3/3] overflow-hidden">
              <img 
                src={necklaceImage} 
                alt="Necklace" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white/80 text-sm uppercase mb-1 block">Elegant Picks</span>
                <h3 className="text-2xl font-semibold text-white mb-3">Necklace</h3>
                <Link 
                  to="/collections/all?category=Necklace"
                  className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-base hover:bg-black hover:text-white transition-all duration-300 group/btn"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Purse */}
          <div className="group relative overflow-hidden rounded-lg shadow-md">
            <div className="aspect-[3/3] overflow-hidden">
              <img 
                src={purseImage} 
                alt="Purse" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white/80 text-sm uppercase mb-1 block">Trendy Picks</span>
                <h3 className="text-2xl font-semibold text-white mb-3">Purse</h3>
                <Link 
                  to="/collections/all?category=Purse"
                  className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-base hover:bg-black hover:text-white transition-all duration-300 group/btn"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
