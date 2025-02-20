import React, { useState, useRef, useEffect, useContext } from "react";
import { FiSearch, FiX, FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import logo from '../../assets/logo.png';
import ThemeToggle from "../../context/ThemeToggle";
import { ThemeContext } from "../../context/ThemeContext"; // Make sure this path is correct

const DeliveryHeader = ({ isOpen, setIsOpen }) => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const delivery_id = searchParams.get("delivery_id");
  const { theme } = useContext(ThemeContext); // Get current theme from context

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-purple-600 to-indigo-700'} fixed top-0 left-0 w-full z-50 shadow-lg transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
              <img src={logo} alt="Foodie Buddie Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="ml-2 text-lg sm:text-xl md:text-2xl font-semibold text-white hidden sm:block">
              Foodie Buddie <span className="font-light">Delivery</span>
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <div className={`flex items-center ${theme === 'dark' ? 'bg-gray-700 bg-opacity-50' : 'bg-white bg-opacity-10'} backdrop-blur-sm hover:bg-opacity-20 transition duration-200 h-10 rounded-full px-3 w-full border ${theme === 'dark' ? 'border-gray-600' : 'border-white border-opacity-20'}`}>
                <FiSearch className="text-white h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search deliveries..."
                  className="ml-2 outline-none border-none bg-transparent text-sm text-white placeholder-white placeholder-opacity-70 w-full"
                />
              </div>
            </div>
          </div>

          {/* Right Section: Theme Toggle & Profile */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Mobile Search Icon */}
            <button 
              className="p-1 rounded-full text-white hover:bg-white hover:bg-opacity-10 sm:hidden"
              onClick={toggleSearch}
            >
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <div className="text-white">
              <ThemeToggle />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white bg-opacity-10 hover:bg-opacity-20'} transition duration-200`}
                onClick={toggleDropdown}
              >
                <FiUser className="text-white h-5 w-5" />
              </button>

              {isOpen && (
                <div className={`absolute right-0 mt-2 w-48 origin-top-right ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden`}>
                  <div className="py-1">
                    <NavLink 
                      to="/delivery/signup?role=delivery"
                      className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition duration-150`}
                    >
                      Sign Up
                    </NavLink>
                    <NavLink 
                      to="/delivery/login?role=delivery"
                      className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition duration-150`}
                    >
                      Login
                    </NavLink>
                    <NavLink 
                      to="/"
                      className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition duration-150`}
                    >
                      Home
                    </NavLink>
                    <NavLink 
                      to="/contact-us"
                      className={`block px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition duration-150`}
                    >
                      Contact Us
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Shown when search is toggled */}
      {showSearch && (
        <div ref={searchRef} className={`p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-indigo-800'} sm:hidden`}>
          <div className={`flex items-center ${theme === 'dark' ? 'bg-gray-700 bg-opacity-50' : 'bg-white bg-opacity-10'} backdrop-blur-sm h-10 rounded-full px-3 w-full border ${theme === 'dark' ? 'border-gray-600' : 'border-white border-opacity-20'}`}>
            <FiSearch className="text-white h-4 w-4" />
            <input
              type="text"
              placeholder="Search deliveries..."
              className="ml-2 outline-none border-none bg-transparent text-sm text-white placeholder-white placeholder-opacity-70 w-full"
            />
            <button onClick={toggleSearch}>
              <FiX className="text-white h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DeliveryHeader;