import React, { useState, useRef, useEffect, useContext } from "react";
import { FiSearch, FiX, FiUser, FiPackage, FiHome, FiLogOut, FiMail } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png';
import ThemeToggle from "../../context/ThemeToggle";
import { ThemeContext } from "../../context/ThemeContext";
import {axiosInstance} from "../../utils/axios"; 

const DeliveryUserHeader = ({ isOpen, setIsOpen, profilePic, _id, role, name }) => {
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

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

  const LogOut = async () => {
    try {
      const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      if (response.data.success) {
        navigate(`/${role}`);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-r from-purple-600 to-indigo-700'} fixed top-0 left-0 w-full z-50 shadow-lg transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10">
              <img src={logo} alt="Foodie Buddie Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="ml-2 text-lg sm:text-xl md:text-2xl font-semibold text-white hidden sm:block">
              <span className="font-normal">Foodie Buddie</span> <span className="font-light">Delivery</span>
            </h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative w-full">
              <div className={`flex items-center ${theme === 'dark' ? 'bg-gray-700 bg-opacity-50' : 'bg-white bg-opacity-10'} backdrop-blur-sm hover:bg-opacity-20 transition duration-200 h-10 rounded-full px-3 w-full border ${theme === 'dark' ? 'border-gray-600' : 'border-white border-opacity-20'}`}>
                <FiSearch className="text-white h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="ml-2 outline-none border-none bg-transparent text-sm text-white placeholder-white placeholder-opacity-70 w-full"
                />
              </div>
            </div>
          </div>

          {/* Right Section: Search (Mobile), Theme Toggle, Profile */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Mobile Search Icon */}
            <button 
              className={`p-1 rounded-full ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-white hover:bg-white hover:bg-opacity-10'} md:hidden focus:outline-none`}
              onClick={toggleSearch}
            >
              <FiSearch className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <div className="text-white">
              <ThemeToggle />
            </div>

            {/* Welcome text for larger screens */}
            {name && (
              <div className="hidden lg:block">
                <p className="text-white text-sm">Welcome, <span className="font-medium">{name}</span></p>
              </div>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className="flex items-center justify-center focus:outline-none"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <img
                  src={profilePic || "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png"}
                  alt="Profile"
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 transition-all duration-200 ${
                    theme === 'dark'  
                      ? 'border-gray-600 hover:border-gray-400'
                      : 'border-white border-opacity-50 hover:border-opacity-100'
                  }`}
                />
              </button>

              {isOpen && (
                <div 
                  className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } overflow-hidden transition-all duration-200`}
                >
                  {name && (
                    <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700 text-gray-200' : 'border-gray-200 text-gray-700'}`}>
                      <p className="text-sm font-medium truncate">{name}</p>
                      <p className="text-xs truncate opacity-75">{role}</p>
                    </div>
                  )}

                  <div className="py-1">
                    <NavLink 
                      to={`/delivery/user/${_id}/${role}`}
                      className={({ isActive }) => `flex items-center px-4 py-2 text-sm ${
                        theme === 'dark' 
                          ? `${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                          : `${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                      } transition-colors duration-150`}
                    >
                      <FiHome className="mr-3 h-4 w-4" /> Home
                    </NavLink>

                    <NavLink 
                      to={`orders?delivery_id=${_id}`}
                      className={({ isActive }) => `flex items-center px-4 py-2 text-sm ${
                        theme === 'dark' 
                          ? `${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                          : `${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                      } transition-colors duration-150`}
                    >
                      <FiPackage className="mr-3 h-4 w-4" /> Orders
                    </NavLink>

                    <NavLink 
                      to={`editprofile`}
                      className={({ isActive }) => `flex items-center px-4 py-2 text-sm ${
                        theme === 'dark' 
                          ? `${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                          : `${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                      } transition-colors duration-150`}
                    >
                      <FiUser className="mr-3 h-4 w-4" /> Profile
                    </NavLink>

                    <NavLink 
                      to="/delivery/contact-us"
                      className={({ isActive }) => `flex items-center px-4 py-2 text-sm ${
                        theme === 'dark' 
                          ? `${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`
                          : `${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`
                      } transition-colors duration-150`}
                    >
                      <FiMail className="mr-3 h-4 w-4" /> Contact Us
                    </NavLink>

                    <button 
                      onClick={LogOut}
                      className={`flex w-full items-center px-4 py-2 text-sm ${
                        theme === 'dark' 
                          ? 'text-red-400 hover:bg-gray-700'
                          : 'text-red-600 hover:bg-gray-100'
                      } transition-colors duration-150`}
                    >
                      <FiLogOut className="mr-3 h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Shown when search is toggled */}
      {showSearch && (
        <div ref={searchRef} className={`p-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-indigo-600'} md:hidden`}>
          <div className={`flex items-center ${theme === 'dark' ? 'bg-gray-600 bg-opacity-50' : 'bg-white bg-opacity-10'} backdrop-blur-sm h-10 rounded-full px-3 w-full border ${theme === 'dark' ? 'border-gray-600' : 'border-white border-opacity-20'}`}>
            <FiSearch className="text-white h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              className="ml-2 outline-none border-none bg-transparent text-sm text-white placeholder-white placeholder-opacity-70 w-full"
            />
            <button onClick={toggleSearch} className="focus:outline-none">
              <FiX className="text-white h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DeliveryUserHeader;
// import React, { useState, useRef, useEffect, useContext } from "react";
// import { FiSearch, FiX } from "react-icons/fi";
// import { IoCart } from "react-icons/io5";
// import { NavLink } from "react-router-dom";
// import logo from '../../assets/logo.png'
// import { useLocation } from "react-router-dom";
// import ThemeToggle from "../../context/ThemeToggle";

// import { ThemeContext } from "../../context/ThemeContext";


// const DeliveryUserHeader = ({ isOpen, setIsOpen,profilePic,_id,role,name }) => {
//   const [showSearch, setShowSearch] = useState(false);
//   const searchRef = useRef(null);
//   const { theme } = useContext(ThemeContext);
// //   const location = useLocation();
// //   const searchParams = new URLSearchParams(location.search);
// //   const delivery_id = searchParams.get("delivery_id");

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
//   const LogOut=async()=>{
  

//     try {
//       const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
  
//       if (response.data.success) {
        
//         navigate(`/${role}`);
//       }
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
  
//   }
//   return (
//     <div className="bg-purple-300 flex justify-around items-center p-4 fixed top-0 left-0 w-full z-50 shadow-lg">
      
//       <div className="flex items-center space-x-2 p-2">
//         <div className="w-10 h-10 sm:w-12 sm:h-12">
//           <img src={logo} alt="Logo" className="w-full h-full object-contain" />
//         </div>
//         <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white hidden sm:block">
//           Foodie Buddie Delivery
//         </h1>
//       </div>

//       <div className="flex items-center">
//         {!showSearch ? (
//           <FiSearch
//             className="text-white h-6 w-6 cursor-pointer sm:hidden"
//             onClick={toggleSearch}
//           />
//         ) : (
//           <div ref={searchRef} className="absolute top-12 left-1/2 transform -translate-x-1/2 w-10/12 sm:w-auto">
//             <div className="flex items-center bg-white h-10 sm:h-12 rounded-full px-3 w-full">
//               <FiSearch className="text-gray-600 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="ml-2 outline-none border-none bg-transparent text-sm text-gray-700 w-full"
//               />
//               <FiX className="text-gray-600 h-5 w-5 cursor-pointer" onClick={toggleSearch} />
//             </div>
//           </div>
//         )}

//         <div className="hidden sm:flex items-center bg-white h-10 sm:h-12 rounded-full px-3 w-full max-w-xs sm:max-w-md md:max-w-lg">
//           <FiSearch className="text-gray-600 h-5 w-5" />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="ml-2 outline-none border-none bg-transparent text-sm text-gray-700 w-full"
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-4">

//         <div className="relative  flex gap-10">
//        <ThemeToggle/>
//           <div className="cursor-pointer" onClick={toggleDropdown}>
//           <img
//                 src={profilePic || "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png"}
//                 alt="Profile"
//                 className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-colors ${
//                   theme === 'dark'  
//                     ? 'border-gray-600 hover:border-gray-500'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
                
//               />
//           </div>

//           {isOpen && (
//             <div className="absolute right-0 mt-2 w-48 p-2 bg-green-100 border border-gray-300 rounded-lg shadow-lg">
//               <ul className="p-1 space-y-1">
              
                  
//                   <li className="p-2 hover:bg-gray-200 cursor-pointer bg-blue-200 rounded-full shadow-lg">
//                     <NavLink to={`orders?delivery_id=${_id}`}>Orders</NavLink>
//                   </li>
//                   <li className="p-2 hover:bg-gray-200 cursor-pointer bg-blue-200 rounded-full shadow-lg">
//                     <NavLink to={`editprofile`}>Profile</NavLink>
//                   </li>
//                   <li className="p-2 hover:bg-gray-200 cursor-pointer bg-red-200 rounded-full shadow-lg" onClick={()=>LogOut}>
//                     LogOut
//                   </li>
//                 <li className="p-2 hover:bg-gray-200 cursor-pointer bg-purple-200 rounded-full shadow-lg">
//                   <NavLink to={`/delivery/user/${_id}/${role}`}>Home</NavLink>
//                 </li>
//                 <li className="p-2 hover:bg-gray-200 cursor-pointer bg-orange-200 rounded-full shadow-lg">
//                   <NavLink to="/delivery/contact-us">Contact Us</NavLink>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default DeliveryUserHeader;


