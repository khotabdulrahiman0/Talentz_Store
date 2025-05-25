import React from 'react';
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { BsFillTelephoneFill } from "react-icons/bs";

const TopBar = () => {
  return (
    <div className="bg-rabit-red text-white py-2">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-300 transition">
            <TbBrandMeta className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            <IoLogoInstagram className="h-6 w-6" />
          </a>
          <a href="#" className="hover:text-gray-300 transition">
            <RiTwitterXLine className="h-6 w-6" />
          </a>
        </div>

        {/* Shipping Info */}
        <div className="text-sm text-center md:text-left my-2 md:my-0">
          <span>We ship worldwide - Fast and reliable shipping!</span>
        </div>

        {/* Contact Info */}
        <div className="flex items-center space-x-2 text-sm">
          <BsFillTelephoneFill className="h-4 w-4" />
          <a href="tel:+917507759703" className="hover:text-gray-300 transition">+91 7507759703</a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
