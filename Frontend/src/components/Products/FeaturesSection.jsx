import React from 'react';
import { HiOutlineCreditCard, HiShoppingBag } from 'react-icons/hi';
import { HiArrowPathRoundedSquare } from 'react-icons/hi2';

const FeaturesSection = () => {
  return (
    <section className='py-20 px-4 bg-gradient-to-b from-white to-gray-50'>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        {/* Feature 1 */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
          <div className="p-4 mb-4 bg-emerald-50 rounded-full text-emerald-600">
            <HiShoppingBag className='text-3xl' />
          </div>
          <h4 className='text-xl font-semibold text-gray-900 mb-3'>
            Free International Shipping
          </h4>
          <p className='text-gray-600 text-sm leading-relaxed'>
            On all orders over $1000.00
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
          <div className="p-4 mb-4 bg-amber-50 rounded-full text-amber-600">
            <HiArrowPathRoundedSquare className='text-3xl' />
          </div>
          <h4 className='text-xl font-semibold text-gray-900 mb-3'>
            45 Days Return
          </h4>
          <p className='text-gray-600 text-sm leading-relaxed'>
            Money-back guarantee
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2">
          <div className="p-4 mb-4 bg-blue-50 rounded-full text-blue-600">
            <HiOutlineCreditCard className='text-3xl' />
          </div>
          <h4 className='text-xl font-semibold text-gray-900 mb-3'>
            Secure Checkout
          </h4>
          <p className='text-gray-600 text-sm leading-relaxed'>
            100% secured checkout process
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;