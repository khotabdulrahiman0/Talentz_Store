import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-semibold tracking-wide text-gray-800">
          Talentz Store
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?category=Necklace"
            className="text-gray-600 hover:text-black text-sm font-medium uppercase"
          >
            Necklace
          </Link>
          <Link
            to="/collections/all?category=Purse"
            className="text-gray-600 hover:text-black text-sm font-medium uppercase"
          >
            Purse
          </Link>
          <Link
            to="/collections/all?category=Bracelet"
            className="text-gray-600 hover:text-black text-sm font-medium uppercase"
          >
            Bracelet
          </Link>
        </div>

        {/* Right icons */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link to="/admin" className="bg-black text-white px-3 py-1 rounded text-sm">
              Admin
            </Link>
          )}
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button onClick={toggleCartDrawer} className="relative hover:text-black">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute top-[-8px] right-[-10px] bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          <div>
            <SearchBar />
          </div>
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-7 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* Mobile nav drawer */}
      <div
        className={`fixed top-0 left-0 w-40 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all?category=Necklaces"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Necklaces
            </Link>
            <Link
              to="/collections/all?category=Earrings"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Earrings
            </Link>
            <Link
              to="/collections/all?category=Rings"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Rings
            </Link>
            <Link
              to="/collections/all?category=Bracelets"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Bracelets
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
