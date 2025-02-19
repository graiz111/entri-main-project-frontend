import React, { useState, useRef, useEffect, useContext } from "react";
import { FiSearch, FiX, FiUser, FiPackage, FiHome, FiLogOut } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import ThemeToggle from "../../context/ThemeToggle";
import { axiosInstance } from "../../utils/axios";
import logo from '../../assets/logo.png';
const DeliveryUserHeader = ({ isOpen, setIsOpen, profilePic, _id, role, name }) => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleSearch = () => setShowSearch(!showSearch);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const LogOut = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      if (response.data.success) {
        window.history.pushState(null, null, '/');
        window.onpopstate = function() {
          window.history.pushState(null, null, '/');
        };
        navigate('/delivery', { replace: true });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const isDark = theme === 'dark';

  return (
    <header className={`fixed top-0 p-3 left-0 w-full z-50 transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-white'
    } border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
     
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full">
            <img src={logo} alt="Foodie Buddie Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Foodie Buddie
                <span className="text-indigo-500 ml-1">Delivery</span>
              </h1>
            </div>
          </div>

       
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className={`flex items-center h-10 rounded-full px-4 ${
                isDark ? 'bg-gray-800' : 'bg-gray-100'
              } transition duration-200`}>
                <FiSearch className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className={`ml-3 w-full bg-transparent outline-none text-sm ${
                    isDark ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'
                  }`}
                />
              </div>
            </div>
          </div>

         
          <div className="flex items-center space-x-4">
  
            <button 
              className={`md:hidden p-2 rounded-full ${
                isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
              onClick={toggleSearch}
            >
              <FiSearch className="h-5 w-5" />
            </button>

         
            <div className="text-gray-600 dark:text-gray-300">
              <ThemeToggle />
            </div>

   
            {name && (
              <div className="hidden lg:block">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Welcome, <span className="font-medium">{name}</span>
                </p>
              </div>
            )}

      
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
              >
                <img
                  src={profilePic || "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png"}
                  alt="Profile"
                  className={`w-9 h-9 rounded-full object-cover ring-2 transition-all duration-200 ${
                    isDark ? 'ring-gray-700 hover:ring-gray-600' : 'ring-gray-200 hover:ring-gray-300'
                  }`}
                />
              </button>

              {isOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                  isDark ? 'bg-gray-900 ring-1 ring-gray-800' : 'bg-white ring-1 ring-gray-200'
                }`}>
                  <div className={`px-4 py-3 border-b ${
                    isDark ? 'border-gray-800' : 'border-gray-100'
                  }`}>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                      {name}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {role}
                    </p>
                  </div>

                  <div className="py-1">
                    {[
                      { to: `/delivery/user/${_id}/${role}`, icon: FiHome, label: 'Home' },
                      { to: `orders?delivery_id=${_id}`, icon: FiPackage, label: 'Orders' },
                      { to: 'editprofile', icon: FiUser, label: 'Profile' }
                    ].map(({ to, icon: Icon, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `
                          flex items-center px-4 py-2 text-sm transition-colors duration-150
                          ${isDark
                            ? isActive
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : isActive
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                          }
                        `}
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {label}
                      </NavLink>
                    ))}

                    <button
                      onClick={LogOut}
                      className={`flex w-full items-center px-4 py-2 text-sm ${
                        isDark
                          ? 'text-red-400 hover:bg-gray-800'
                          : 'text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      <FiLogOut className="mr-3 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

 
      {showSearch && (
        <div ref={searchRef} className={`p-4 border-t ${
          isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        } md:hidden`}>
          <div className={`flex items-center h-10 rounded-lg px-3 ${
            isDark ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <FiSearch className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search orders..."
              className={`ml-2 w-full bg-transparent outline-none text-sm ${
                isDark ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'
              }`}
            />
            <button onClick={toggleSearch} className="focus:outline-none">
              <FiX className={`h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DeliveryUserHeader;
