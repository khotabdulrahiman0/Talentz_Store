import React from 'react';
import heroImg from "../../assets/armk-hero.png";
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, RefreshCw } from 'react-feather';

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0">
        <img 
          src={heroImg} 
          alt="Summer fashion collection" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen">
        {/* Top Navigation Hints */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-6 text-white/90 text-sm">
            <Link to="/" className="hover:text-white transition-colors">New Arrivals</Link>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <Link to="/" className="hover:text-white transition-colors">Best Sellers</Link>
            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
            <Link to="/" className="hover:text-white transition-colors">Sale</Link>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-4xl">
            {/* Season Tag */}
            <div className="mb-8 flex justify-center">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">Summer Collection 2025</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="text-center space-y-6">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight">
                Elevate Your
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/80">
                  Presence
                </span>
              </h1>

              <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed font-light">
                Discover pieces that transcend seasons and define your unique style narrative.
              </p>

              {/* CTA Button */}
              <div className="pt-8">
                <Link 
                  to="/collections/all"
                  className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all duration-300"
                >
                  <span className="font-medium">Explore Collection</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl">
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-white/90">
              <Truck className="w-5 h-5 mb-2" />
              <span className="text-sm text-center">Free Global Shipping</span>
            </div>
            <div className="flex flex-col items-center text-white/90">
              <Star className="w-5 h-5 mb-2" />
              <span className="text-sm text-center">Premium Quality</span>
            </div>
            <div className="flex flex-col items-center text-white/90">
              <RefreshCw className="w-5 h-5 mb-2" />
              <span className="text-sm text-center">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;