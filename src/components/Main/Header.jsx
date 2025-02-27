import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FiSearch, FiX, FiHome, FiPhone, FiUser } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import logo from '../../assets/logo.png';
import ThemeToggle from "../../context/ThemeToggle";

const Header = ({ isOpen, setIsOpen }) => {
  const { theme } = useContext(ThemeContext);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

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
    <header className={`
      ${theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}
      shadow-md p-3 fixed top-0 left-0 w-full z-50
    `}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-4 ">
          <NavLink to="/" className="flex items-center">
            <img src={logo} alt="Foodie Buddie Logo" className="h-10 w-10 object-contain mr-2 rounded-full" />
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold hidden sm:block"
              style={{
                fontFamily: 'Pacifico, cursive',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
              Foodie Buddie
            </h1>
          </NavLink>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className={({ isActive }) => `flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'} transition-colors ${isActive ? `${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-semibold` : ''}`}>
            <FiHome className="mr-1" /> Home
          </NavLink>
          <NavLink to="/contact-us" className={({ isActive }) => `flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-300 hover:text-green-400' : 'text-gray-700 hover:text-green-600'} transition-colors ${isActive ? `${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-semibold` : ''}`}>
            <FiPhone className="mr-1" /> Contact
          </NavLink>
        </nav>

        <div className="flex items-center space-x-4">
          <div className={`hidden md:flex items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-full px-4 py-2`}>
            <FiSearch className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
            <input type="text" placeholder="Search..." className={`bg-transparent outline-none ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} w-full`} />
          </div>

          <div className="relative flex gap-6 items-center">
            <ThemeToggle/>
            <div onClick={toggleDropdown} className="cursor-pointer">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-green-400 hover:border-green-300' : 'border-green-600 hover:border-green-500'}`}>
                <FiUser className={`h-6 w-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} hover:opacity-80`} />
              </div>
            </div>
            {isOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                <ul className="py-1">
                  {[{ to: "/signup?role=user", label: "Sign Up", color: "text-yellow-600" },
                    { to: "/login?role=user", label: "Login", color: "text-green-600" },
                    { to: "/restaurant", label: "Restaurant", color: "text-orange-600" },
                    { to: "/admin", label: "Admin", color: "text-purple-600" },
                    { to: "/delivery", label: "Delivery", color: "text-red-600" },
                    { to: "/contact-us", label: "Contact Us", color: "text-blue-600" }]
                    .map((item, index) => (
                      <li key={index} className="hover:bg-gray-100">
                        <NavLink to={item.to} className={`block px-4 py-2 ${item.color} hover:bg-gray-100`}>
                          {item.label}
                        </NavLink>
                      </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


