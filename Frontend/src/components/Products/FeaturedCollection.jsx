import React from 'react';
import { ArrowRight } from 'react-feather';
import newBanner from "../../assets/follow.jpg"; 

const FeaturedCollection = () => {
  return (
    <section className="relative bg-neutral-100">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Image Side */}
          <div className="w-full md:w-1/2">
            <div className="relative group">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors rounded-2xl" />
              <img 
                src={newBanner}
                alt="Showcase banner"
                className="w-full h-[500px] object-cover rounded-2xl"
              />
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-sm font-medium">Official Launch</p>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 space-y-8 md:pl-8">
            <div>
              <h2 className="text-6xl font-bold mb-6">
                Welcome to <br /> Our New Journey
              </h2>
              <p className="text-lg text-neutral-600">
                Explore what's coming next – unique designs, creative ideas, and much more on the way.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* <div className="bg-white p-4 rounded-xl">
                <p className="text-2xl font-bold mb-1">Launching Soon</p>
                <p className="text-sm text-neutral-500">Stay Tuned</p>
              </div> */}
              <div className="bg-white p-4 rounded-xl">
                <p className="text-2xl font-bold mb-1">Exclusive</p>
                <p className="text-sm text-neutral-500">First Look Access</p>
              </div>
            </div>

            <div className="space-y-4">
              <a 
                href="https://www.instagram.com/_talentz_store_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-black text-white px-8 py-4 rounded-xl hover:bg-neutral-800 transition-colors w-full"
              >
                <span className="text-lg font-medium">Visit Our Instagram Page</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-200 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-neutral-200 rounded-full blur-3xl -z-10" />
    </section>
  );
};

export default FeaturedCollection;
