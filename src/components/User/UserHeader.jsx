
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

                {/* {isOpen && (
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
                      )} */}
                      {isOpen && (
                        <div
                          className={`absolute right-0  w-40 rounded-lg shadow-lg border transition-all duration-300 transform origin-top ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-white border-gray-100'
                          } ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                        >
                          {/* Profile */}
                          <NavLink to="editprofile">
                            <div
                              className={`px-4 py-3 text-sm flex items-center hover:bg-opacity-20 transition-colors duration-200 ${
                                theme === 'dark'
                                  ? 'text-gray-200 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Profile
                            </div>
                          </NavLink>

                          {/* Orders */}
                          <NavLink to={`orders?user_id=${_id}`}>
                            <div
                              className={`px-4 py-3 text-sm flex items-center hover:bg-opacity-20 transition-colors duration-200 ${
                                theme === 'dark'
                                  ? 'text-gray-200 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                              </svg>
                              Orders
                            </div>
                          </NavLink>

                          {/* Add Address */}
                          <NavLink to={`addaddress?user_id=${_id}`}>
                            <div
                              className={`px-4 py-3 text-sm flex items-center hover:bg-opacity-20 transition-colors duration-200 ${
                                theme === 'dark'
                                  ? 'text-gray-200 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                              </svg>
                              Add Address
                            </div>
                          </NavLink>
                          <NavLink to={`/user/${_id}/${role}`}>
                            <div
                              className={`px-4 py-3 text-sm flex items-center hover:bg-opacity-20 transition-colors duration-200 ${
                                theme === 'dark'
                                  ? 'text-gray-200 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                              </svg>
                              Home
                            </div>
                          </NavLink>

                          {/* Contact Us */}
                          <NavLink to="contact-us">
                            <div
                              className={`px-4 py-3 text-sm flex items-center hover:bg-opacity-20 transition-colors duration-200 ${
                                theme === 'dark'
                                  ? 'text-gray-200 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                              Contact Us
                            </div>
                          </NavLink>

                          {/* About Us */}
                          <NavLink to="about-us">
                            <div
                              className={`px-4 py-3 text-sm flex items-center hover:bg-opacity-20 transition-colors duration-200 ${
                                theme === 'dark'
                                  ? 'text-gray-200 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              About Us
                            </div>
                          </NavLink>

                          {/* Logout */}
                          <div
                            className={`px-4 py-3 text-sm flex items-center hover:bg-opacity-20 transition-colors duration-200 cursor-pointer ${
                              theme === 'dark'
                                ? 'text-gray-200 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => Logout()}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Logout
                          </div>
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
