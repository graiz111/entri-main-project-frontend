import React, { useState, useContext, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search,Home,Users,ShoppingBag,Truck,Mail,Menu, LogOut} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import ThemeToggle from '../../context/ThemeToggle';
import logo from '../../assets/logo.png';
import { axiosInstance } from '../../utils/axios';

const AdminUserHeader = ({ isOpen,setIsOpen,profilePic,_id, role, name }) => {



  const navigate=useNavigate()
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

const Logout=async()=>{
  
console.log("enteredadmin logout front ");

  try {
    const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });

    if (response.data.success) {
      
      navigate(`/${role}`);
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }

}

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
            <NavLink to={`/admin/user/${_id}/${role}`}>
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'   
                  ? 'hover:bg-gray-700 text-gray-200' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}>
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            </NavLink>

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
                src={profilePic || "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-color-icon.png"}
                alt="Profile"
                className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-colors ${
                  theme === 'dark'  
                    ? 'border-gray-600 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={toggleDropdown}
              />
                {isOpen && (
                  <div className="relative">
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                    }`}>
                      <NavLink to="/admin/coupons">
                        <div className={`flex items-center px-4 py-2 text-sm hover:bg-opacity-20 ${
                          theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}>
                          <Users className="h-4 w-4 mr-2" />
                          Add Coupons
                        </div>
                      </NavLink>
                      
                      <div
                        className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-opacity-20 ${
                          theme === 'dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => Logout()} 
                      >
                        <LogOut className="h-4 w-4 mr-2"/>
                        Logout
                      </div>
                    </div>
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
              <Search className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
              <input
                type="text"
                placeholder="Search..."
                className={`ml-2 bg-transparent outline-none text-sm w-full ${
                  theme === 'dark'   
                    ? 'placeholder-gray-400 text-gray-200' 
                    : 'placeholder-gray-500 text-gray-700'
                }`}
              />
            </div>
            <NavLink to="/admin">
              <div className={`px-4 py-2 text-sm rounded-lg ${
                theme === 'dark'  
                  ? 'text-gray-200 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}>Dashboard</div>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserHeader;
