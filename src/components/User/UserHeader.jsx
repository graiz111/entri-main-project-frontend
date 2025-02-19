
import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate, useLocation, useParams } from "react-router-dom";
import { FiSearch, FiX, FiHome, FiPhone, FiMenu } from "react-icons/fi";
import { IoCart } from "react-icons/io5";
import { ThemeContext } from "../../context/ThemeContext";
import ThemeToggle from "../../context/ThemeToggle";
import logo from "../../assets/logo.png";

import { axiosInstance } from "../../utils/axios";

const UserHeader = ({ isOpen, setIsOpen, profilepic,_id,role }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const openCart = () => {
    navigate(`usercart/${_id}`);
  };
  const Logout = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
  
      if (response.data.success) {
       
        
        window.history.pushState(null, null, '/');
        window.onpopstate = function() {
          window.history.pushState(null, null, '/');
        };
        
        navigate('/', { replace: true });
        
        
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className={`${
      theme === 'dark'   
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    } border-b p-3 shadow-sm fixed top-0 left-0 w-full z-50`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-full"
            />
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold hidden md:block"
              style={{
                fontFamily: 'Pacifico, cursive',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
              <NavLink to={`/`}>Foodie Buddie</NavLink>
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to={`/user/${_id}/${role}`}
              className={({ isActive }) => `flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'text-purple-500' 
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-purple-400'
                    : 'text-gray-700 hover:text-purple-500'
              }`}
            >
              <FiHome className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            
            <NavLink 
              to="contact-us"
              className={({ isActive }) => `flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'text-purple-500' 
                  : theme === 'dark'
                    ? 'text-gray-300 hover:text-purple-400'
                    : 'text-gray-700 hover:text-purple-500'
              }`}
            >
              <FiPhone className="w-4 h-4" />
              <span>Contact</span>
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <div className="relative cursor-pointer" onClick={openCart}>
              <IoCart className={`h-6 w-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`} />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                0
              </div>
            </div>

            <ThemeToggle className="bg-white"/>

            <div className="relative">
              <img
                src={profilepic || "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png"}
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
                          <NavLink to={`editprofile`}>
                            <div className={`px-4 py-2 text-sm hover:bg-opacity-20 ${
                              theme === 'dark'  
                                ? 'text-gray-200 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}>Profile</div>
                          </NavLink>
                          <NavLink to={`orders?user_id=${_id}`}>
                            <div className={`px-4 py-2 text-sm hover:bg-opacity-20 ${
                              theme === 'dark'  
                                ? 'text-gray-200 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}>Orders</div>
                          </NavLink>
                          <NavLink to={`addaddress?user_id=${_id}`}>
                            <div className={`px-4 py-2 text-sm hover:bg-opacity-20 ${
                              theme === 'dark'  
                                ? 'text-gray-200 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}>Add Address</div>
                          </NavLink>
                          <NavLink to="contact-us">
                            <div className={`px-4 py-2 text-sm hover:bg-opacity-20 ${
                              theme === 'dark'  
                                ? 'text-gray-200 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}>Contact Us</div>
                          </NavLink>
                          <NavLink to="about-us">
                            <div className={`px-4 py-2 text-sm hover:bg-opacity-20 ${
                              theme === 'dark'  
                                ? 'text-gray-200 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}>About Us</div>
                          </NavLink>
                          <NavLink >
                            <div className={`px-4 py-2 text-sm hover:bg-opacity-20 ${
                              theme === 'dark'  
                                ? 'text-gray-200 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`} onClick={()=>Logout()} >Logout</div>
                          </NavLink>
                        </div>
                      )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
