import { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { NavLink,useLocation } from "react-router-dom";
import logo from '../../assets/logo.png'
import axios from 'axios'

const RestaurantHeader = ({isOpen,setIsOpen}) => {
  const [User, setUser] = useState({})
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const restaurant_id = searchParams.get("restaurant_id");

  useEffect(() => {
      if (!restaurant_id) return;
  
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/restaurant/users/${restaurant_id}`, {
            
          });
        console.log(response.data);
        
          setUser(response.data);
          
        } catch (err) {
          console.log(err)
        }
      };
  
      fetchUserDetails();
    }, [restaurant_id]);
    const Profilepic=User.profilePic

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
    <div className="bg-orange-300 flex justify-around items-center p-4 fixed top-0 left-0 w-full z-50 shadow-lg">
      
      <div className="flex items-center space-x-2 p-2">
        <div className="w-10 h-10 sm:w-12 sm:h-12">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white hidden sm:block">
          {User.name ? `${User.name.toUpperCase()} RESTAURANT` : "FOODIE BUDDIE RESTAURANT"}
        </h1>
      </div>

      <div className="flex items-center">
        {!showSearch ? (
          <FiSearch
            className="text-white h-6 w-6 cursor-pointer sm:hidden"
            onClick={toggleSearch}
          />
        ) : (
          <div ref={searchRef} className="absolute top-12 left-1/2 transform -translate-x-1/2 w-10/12 sm:w-auto">
            <div className="flex items-center bg-white h-10 sm:h-12 rounded-full px-3 w-full">
              <FiSearch className="text-gray-600 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                className="ml-2 outline-none border-none bg-transparent text-sm text-gray-700 w-full"
              />
              <FiX className="text-gray-600 h-5 w-5 cursor-pointer" onClick={toggleSearch} />
            </div>
          </div>
        )}

        {/* Desktop Search Bar */}
        <div className="hidden sm:flex items-center bg-white h-10 sm:h-12 rounded-full px-3 w-full max-w-xs sm:max-w-md md:max-w-lg">
          <FiSearch className="text-gray-600 h-5 w-5" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 outline-none border-none bg-transparent text-sm text-gray-700 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        
     

        <div className="relative">
          <div className="cursor-pointer" onClick={toggleDropdown}>
              <img
                src={Profilepic || "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png"}
                alt="Dropdown Trigger"
                className="max-w-16 max-h-14 rounded-full border border-black p-1"
              />
          </div>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 p-2 bg-green-100 border border-gray-300 rounded-lg shadow-lg">
              <ul className="p-1 space-y-1">
              {!restaurant_id ? (
                  <li className="p-2 hover:bg-gray-200 cursor-pointer bg-green-300 rounded-full">
                    <NavLink to="/restaurant/login?role=restaurant">Login</NavLink>
                  </li>
                ) : (
                  <>
                    <li className="p-2 hover:bg-gray-200 cursor-pointer bg-blue-200 rounded-full">
                      <NavLink to={`/restaurant/orders?restaurant_id=${restaurant_id}`}>Orders</NavLink>
                    </li>
                    <li className="p-2 hover:bg-gray-200 cursor-pointer bg-red-200 rounded-full">
                      <NavLink to={`/restaurant/menu?restaurant_id=${restaurant_id}`}>Items</NavLink>
                    </li>
                    <li className="p-2 hover:bg-gray-200 cursor-pointer bg-orange-200 rounded-full">
                      <NavLink to={`/restaurant/settings?restaurant_id=${restaurant_id}`}>Settings</NavLink>
                    </li><li className="p-2 hover:bg-gray-200 cursor-pointer bg-yellow-200 rounded-full">
                      <NavLink to={`/restaurant/settings?restaurant_id=${restaurant_id}`}>LogOut</NavLink>
                    </li>
                  </>
                )}
                <li className="p-2 hover:bg-gray-200 cursor-pointer bg-orange-200 rounded-full">
                  <NavLink to="/restaurant">Home</NavLink>
                </li>
                <li className="p-2 hover:bg-gray-200 cursor-pointer bg-red-200 rounded-full">
                  <NavLink to="/restaurant/contact-us">Contact Us</NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RestaurantHeader;



