import React, { useState, useContext, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Search,
  Home,
  Users,
  ShoppingBag,
  Truck,
  Mail,
  Menu,
  LogOut,
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from '../../context/ThemeToggle';
import logo from '../../assets/logo.png';

const AdminHeader = ({ isOpen,setIsOpen}) => {
  
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
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

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`${
      theme === 'dark'   
        ? 'bg-gray-800 border-gray-700 text-white' 
        : 'bg-white border-gray-200 text-gray-800'
    } border-b p-3 shadow-sm fixed top-0 left-0 w-full z-50`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
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
              Admin Dashboard
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
           

            {/* Search Bar */}
            <div className="relative">
              <div className={`flex items-center rounded-full px-4 py-2 ${
                theme === 'dark'   
                  ? 'bg-gray-700' 
                  : 'bg-gray-100'
              }`}>
                <Search className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`ml-2 bg-transparent outline-none text-sm w-64 ${
                    theme === 'dark'   
                      ? 'placeholder-gray-400 text-gray-200' 
                      : 'placeholder-gray-500 text-gray-700'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Profile Dropdown */}
            <div className="relative">
              <img
                src={"https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png"}
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
                  <NavLink to="/admin/signup?role=admin">
                    <div className={`flex items-center px-4 py-2 text-sm hover:bg-opacity-20 ${
                      theme === 'dark'  
                        ? 'text-gray-200 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      <Users className="h-4 w-4 mr-2" />
                      signUp
                    </div>
                  </NavLink>
                
                <NavLink  to="/admin/login?role=admin">
                <div className={`flex items-center px-4 py-2 text-sm hover:bg-opacity-20 cursor-pointer ${
                    theme === 'dark'  
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    <Users className="h-4 w-4 mr-2" />
                    Login
                   
                  </div>
                </NavLink>
                <NavLink  to="/">
                <div className={`flex items-center px-4 py-2 text-sm hover:bg-opacity-20 cursor-pointer ${
                    theme === 'dark'  
                      ? 'text-gray-200 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Home
                   
                  </div>
                </NavLink>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className={`h-6 w-6 ${
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
        
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeader;
// import React, { useState, useRef, useEffect, useContext } from "react";
// import { FiSearch, FiX, FiMenu } from "react-icons/fi";
// import { NavLink, useLocation } from "react-router-dom";
// import axios from "axios";
// import logo from "../../assets/logo.png";
// import ThemeToggle from "../../context/ThemeToggle";
// import { ThemeContext } from "../../context/ThemeContext";

// const AdminHeader = ({ isOpen, setIsOpen }) => {
//   const [user, setUser] = useState({});
//   const [showSearch, setShowSearch] = useState(false);

//   const { theme } = useContext(ThemeContext);

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const toggleSearch = () => {
//     setShowSearch(!showSearch);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearch(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <header
//       className={`fixed top-0 left-0 w-full z-50 shadow-sm ${
//         theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
//       }`}
//     >
//       <div className="container mx-auto p-5 flex justify-between items-center">
//         {/* Logo and Title */}
//         <div className="flex items-center space-x-4">
//           <div className="w-10 h-10">
//             <img src={logo} alt="Logo" className="w-full h-full object-contain" />
//           </div>
//           <h1 className="text-xl font-semibold hidden sm:block">Foodie Buddie Admin</h1>
//         </div>

//         {/* Search Bar */}
//         <div className="flex items-center space-x-4">
//           {!showSearch ? (
//             <FiSearch
//               className={`h-6 w-6 cursor-pointer sm:hidden ${
//                 theme === "dark" ? "text-white" : "text-gray-900"
//               }`}
//               onClick={toggleSearch}
//               aria-label="Open search"
//             />
//           ) : (
//             <div
//               ref={searchRef}
//               className="absolute top-16 left-1/2 transform -translate-x-1/2 w-10/12 sm:w-auto"
//             >
//               <div
//                 className={`flex items-center h-10 rounded-lg px-3 w-full ${
//                   theme === "dark" ? "bg-gray-700" : "bg-gray-100"
//                 }`}
//               >
//                 <FiSearch
//                   className={`h-5 w-5 ${
//                     theme === "dark" ? "text-gray-400" : "text-gray-600"
//                   }`}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className={`ml-2 outline-none border-none bg-transparent text-sm w-full ${
//                     theme === "dark" ? "text-white" : "text-gray-700"
//                   }`}
//                   aria-label="Search input"
//                 />
//                 <FiX
//                   className={`h-5 w-5 cursor-pointer ${
//                     theme === "dark" ? "text-gray-400" : "text-gray-600"
//                   }`}
//                   onClick={toggleSearch}
//                   aria-label="Close search"
//                 />
//               </div>
//             </div>
//           )}

//           <div
//             className={`hidden sm:flex items-center h-10 rounded-lg px-3 w-64 ${
//               theme === "dark" ? "bg-gray-700" : "bg-gray-100"
//             }`}
//           >
//             <FiSearch
//               className={`h-5 w-5 ${
//                 theme === "dark" ? "text-gray-400" : "text-gray-600"
//               }`}
//             />
//             <input
//               type="text"
//               placeholder="Search..."
//               className={`ml-2 outline-none border-none bg-transparent text-sm w-full ${
//                 theme === "dark" ? "text-white" : "text-gray-700"
//               }`}
//               aria-label="Search input"
//             />
//           </div>
//         </div>

//         {/* Profile and Dropdown */}
//         <div className="flex items-center space-x-6">
//           <ThemeToggle />
//           <div className="relative">
//             <button
//               onClick={toggleDropdown}
//               className="focus:outline-none"
//               aria-label="Toggle dropdown"
//             >
//               <img
//                 src={
                 
//                   "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png"
//                 }
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full border-2 p-1"
//                 style={{
//                   borderColor: theme === "dark" ? "#4A5568" : "#CBD5E0",
//                 }}
//               />
//             </button>

//             {isOpen && (
//               <div
//                 className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
//                   theme === "dark" ? "bg-gray-700" : "bg-white"
//                 }`}
//               >
//                 <ul className="py-2">
//                 <li>
//                         <NavLink
//                           to="/admin/signup?role=admin"
//                           className={`block px-4 py-2 hover:bg-gray-200 ${
//                             theme === "dark" ? "text-white hover:bg-gray-600" : "text-gray-700"
//                           }`}
//                         >
//                           Sign Up
//                         </NavLink>
//                       </li>
//                       <li>
//                         <NavLink
//                           to="/admin/login?role=admin"
//                           className={`block px-4 py-2 hover:bg-gray-200 ${
//                             theme === "dark" ? "text-white hover:bg-gray-600" : "text-gray-700"
//                           }`}
//                         >
//                           Login
//                         </NavLink>
//                       </li>
                 
//                   <li>
//                     <NavLink
//                       to="/admin/contact-us"
//                       className={`block px-4 py-2 hover:bg-gray-200 ${
//                         theme === "dark" ? "text-white hover:bg-gray-600" : "text-gray-700"
//                       }`}
//                     >
//                       Contact Us
//                     </NavLink>
//                   </li>
              
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AdminHeader;
