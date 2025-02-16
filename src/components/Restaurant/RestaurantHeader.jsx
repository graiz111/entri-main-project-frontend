
import { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useLocation,useNavigate } from "react-router-dom";
import { FiSearch, FiX, FiHome, FiPhone, FiMenu } from "react-icons/fi";
import logo from '../../assets/logo.png'
import { ThemeContext } from "../../context/ThemeContext";
import ThemeToggle from "../../context/ThemeToggle";
import axios from 'axios';

import { axiosInstance } from '../../utils/axios';







const RestaurantHeader = ({ isOpen, setIsOpen,profilepic,_id }) => {

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
  
  const { theme } = useContext(ThemeContext);
 


  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.head.removeChild(link);
    };
  }, []);


  

  

  return (
    <div className={`${
      theme === 'dark'   
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    } border-b p-3 shadow-sm fixed top-0 left-0 w-full z-50`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Restaurant Name */}
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold hidden md:block"
              style={{
                fontFamily: 'Pacifico, cursive',  
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
               "FOODIE BUDDIE"
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to={`/restaurant`}>
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'   
                  ? 'hover:bg-gray-700 text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}>
                <FiHome className="h-4 w-4" />
                <span>Home</span>
              </button>
            </NavLink>
            <NavLink to="/restaurant/contact-us">
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'   
                  ? 'hover:bg-gray-700 text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}>
                <FiPhone className="h-4 w-4" />
                <span>Contact</span>
              </button>
            </NavLink>
          
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Profile Dropdown */}
            <div className="relative">
              <img
                src= "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png"
                alt="Profile"
                className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-colors ${
                  theme === 'dark'  
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={toggleDropdown}
              />

              {isOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 ${
                  theme === 'dark'  
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-100'
                }`}>
                  
                    <NavLink to="/restaurant/login?role=restaurant">  
                      <div className={`px-4 py-2 text-sm hover:bg-opacity-20 ${
                        theme === 'dark'  
                          ? 'text-gray-200 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}>Login</div>
                    </NavLink>
                 
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FiMenu className={`h-6 w-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-500'  
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t ${
          theme === 'dark'  
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="px-4 py-2">
            <div className={`flex items-center rounded-full px-4 py-2 mb-2 ${
              theme === 'dark'   
                ? 'bg-gray-700' 
                : 'bg-gray-100'
            }`}>
            </div>
            <NavLink to="/restaurant">
              <div className={`px-4 py-2 text-sm rounded-lg ${
                theme === 'dark'  
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>Home</div>
            </NavLink>
            <NavLink to="/restaurant/contact-us">
              <div className={`px-4 py-2 text-sm rounded-lg ${
                theme === 'dark'  
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>Contact</div>
            </NavLink>
          </div>
        </div>
      )}
     
    </div>
  );
};

export default RestaurantHeader;

