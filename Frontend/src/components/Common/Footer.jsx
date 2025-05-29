import React from 'react';
import { IoLogoInstagram } from 'react-icons/io';
import { RiTwitterXLine } from 'react-icons/ri';
import { MdPhone, MdEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='border-t py-12 bg-gray-100'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
        {/* Newsletter Section */}
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>Newsletter</h3>
          <p className='text-gray-600 text-sm mb-4'>
            Be the first to hear about new products, exclusive events, and online offers.
          </p>
          <form className='flex'>
            <input
              type='email'
              placeholder='Enter your email'
              className='p-3 w-full text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all'
              required
            />
            <button
              type='submit'
              className='bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all'
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>Shop</h3>
          <ul className='space-y-2 text-gray-600'>
            <li><Link to='#' className='hover:text-gray-800 transition-colors'>Purse</Link></li>
            <li><Link to='#' className='hover:text-gray-800 transition-colors'>Necklace</Link></li>
            <li><Link to='#' className='hover:text-gray-800 transition-colors'>Bracelets</Link></li>
            <li><Link to='#' className='hover:text-gray-800 transition-colors'>And More</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>Support</h3>
          <ul className='space-y-2 text-gray-600'>
            <li><Link to='#' className='hover:text-gray-800 transition-colors'>Customer Support</Link></li>
            <li><Link to='#' className='hover:text-gray-800 transition-colors'>Contact Us</Link></li>
            <li><Link to='#' className='hover:text-gray-800 transition-colors'>FAQs</Link></li>
            <li><Link to='#' className='hover:text-gray-800 transition-colors'>Return Policy</Link></li>
          </ul>
        </div>

        {/* Social Media & Contact */}
        <div>
          <h3 className='text-lg font-semibold text-gray-800 mb-3'>Follow Us</h3>
          <div className='flex items-center space-x-4 mb-4'>
            <a href='https://www.instagram.com/_talentz_store_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' target='_blank' rel='noopener noreferrer' className='text-gray-600 hover:text-gray-900 transition'>
              <IoLogoInstagram className='h-6 w-6' />
            </a>
          </div>
          <p className='text-gray-600 font-medium mb-1'>Email Us</p>
          <p className='text-gray-800 flex items-center gap-2 mb-3'>
            <MdEmail className='h-5 w-5' /> guptamansi535@gmail.com
          </p>
          {/* <p className='text-gray-600 font-medium'>Call Us</p>
          <p className='text-gray-800 flex items-center gap-2'>
            <MdPhone className='h-5 w-5' /> 7507759703
          </p> */}
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="container mx-auto mt-3 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className='text-gray-500 text-sm tracking-tighter text-center'>
          ©2025, Armk. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
