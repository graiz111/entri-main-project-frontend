import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../context/ThemeContext";
import { FiClock, FiStar, FiSearch, FiShoppingCart, FiTag, FiClipboard, FiCheck, FiMapPin, FiHeart, FiFilter } from 'react-icons/fi';
import { axiosInstance } from '../../utils/axios';

const UserHome = () => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const { _id, role } = useParams();
    
    const [restaurants, setRestaurants] = useState([]);
    const [popularDishes, setPopularDishes] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [couponsLoading, setCouponsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchdishQuery, setSearchdishQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [copiedCouponId, setCopiedCouponId] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const restaurantsResponse = await axiosInstance.get('/restaurant/allrestaurant');
                setRestaurants(restaurantsResponse.data.data);
                
                const dishesResponse = await axiosInstance.get('/restaurantadd/getallitems');
                setPopularDishes(dishesResponse.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const fetchCoupons = async () => {
            try {
                const couponsResponse = await axiosInstance.get('/user/couponsfetch');
    
                
                setCoupons(couponsResponse.data|| []);
                console.log(couponsResponse.data);
                
            } catch (error) {
                console.error('Error fetching coupons:', error);
                setCoupons([]);
            } finally {
                setCouponsLoading(false);
            }
        };
        fetchCoupons();
    }, []);

    const categories = ['all', 'mandhi', 'biriyani', 'sushi', 'alfahm', 'chinese', 'italian'];
    
    const filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === 'all' || restaurant.category === selectedCategory)
    );
    
    const filtereddishes = popularDishes.filter(dish => 
       dish.name.toLowerCase().includes(searchdishQuery.toLowerCase()) &&
       (selectedCategory === 'all' || dish.category === selectedCategory)
    );

    const addToCart = async (item_id) => {
        try {
            // Fetch restaurant ID using item ID
            const resResponse = await axiosInstance.post("restaurantadd/fetchresid", { itemId: item_id });
        
    
            if (resResponse.data.success === true) {
                const postData = {
                    user_id: _id,                                 // User ID
                    restaurant_id: resResponse.data.restaurant_id, // Extracted Restaurant ID
                    item_id: item_id
                };
    
         
    
              
         
            try {
                const cartResponse = await axiosInstance.post("cart/additemtocart", postData);
        
              
                if (cartResponse.data.success === true) {
                  toast.success("Item added to cart!");
                  ("Cart Response:", cartResponse.data);
                } else {
                  ("Error Condition Met");
                  ("Error Message:", cartResponse.data.message);
                  toast.error(cartResponse.data.message); // This should now work
                }
              } catch (error) {
                console.error("API Call Failed:", error.response?.data || error.message);
              
                if (error.response && error.response.data && error.response.data.message) {
                  toast.error(error.response.data.message); // Show specific API error message
                } else {
                  toast.error("Failed to add item to cart. Please try again.");
                }
              }
              




            } else {
                toast.error("Failed to fetch restaurant ID!");
            }


        } catch (error) {
            console.error("Error in addToCart:", error);
            toast.error("Error happened in cart add");
        }
    };
    
    const handleRestaurantClick = (restaurantsId) => {
        navigate(`userresmenu/${restaurantsId}/${_id}`);
    };

    const handleCopyClick = (couponId, code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                setCopiedCouponId(couponId);
                toast.success(`Coupon ${code} copied to clipboard!`);
                setTimeout(() => setCopiedCouponId(null), 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                toast.error('Failed to copy coupon code');
            });
    };

    return (
        <div className={`min-h-screen ${
            theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
        }`}>
            {/* Hero/Search Section */}
            <div className={`w-full py-12 ${theme === 'dark' ? 'bg-gradient-to-b from-gray-800 to-gray-900' : 'bg-gradient-to-b from-purple-100 to-white'}`}>
                <div className='container mx-auto px-4'>
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                        {theme === 'dark' ? 
                            <span>Find your <span className="text-purple-400">favorite food</span></span> : 
                            <span>Find your <span className="text-purple-600">favorite food</span></span>
                        }
                    </h1>
                    
                    <div className='max-w-3xl mx-auto mb-8 relative'>
                        <div className={`flex items-center rounded-full shadow-lg overflow-hidden border ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                        }`}>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search for restaurants or dishes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full p-4 pl-12 outline-none ${
                                        theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
                                    }`}
                                />
                                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                            </div>
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className={`mx-2 p-2 rounded-full ${
                                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <FiFilter className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                            </button>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                    
                    {showFilters && (
                        <div className={`max-w-3xl mx-auto mb-6 p-4 rounded-lg shadow-md transition-all ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <p className="font-medium mb-3">Categories</p>
                            <div className='flex flex-wrap gap-2'>
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition-colors ${
                                            selectedCategory === category
                                                ? 'bg-purple-600 text-white'
                                                : theme === 'dark'
                                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className='container mx-auto px-4 py-4'>
                {/* Coupons Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <FiTag className={`mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
                            <h2 className="text-2xl font-bold">Available Coupons</h2>
                        </div>
                        {coupons.length > 3 && (
                            <button className={`text-sm ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                                View All
                            </button>
                        )}
                    </div>
                    
                    {couponsLoading ? (
                        <div className={`text-center py-16 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                        }`}>
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
                            <p className="mt-4">Loading coupons...</p>
                        </div>
                    ) : coupons.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coupons.map((coupon) => (
                                <div 
                                    key={coupon._id} 
                                    className={`relative rounded-lg overflow-hidden shadow-md transform hover:shadow-lg transition-all ${
                                        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                                    }`}
                                >
                                    <div className={`px-6 py-4 flex justify-between items-center ${
                                        theme === 'dark' ? 'bg-purple-900/40' : 'bg-purple-100'
                                    }`}>
                                        <div>
                                            <span className={`inline-block text-sm font-bold px-3 py-1 rounded-full ${
                                                theme === 'dark' ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white'
                                            }`}>
                                                {coupon.discountType === 'percentage' ? `${coupon.discountPercentage}% OFF` : `${coupon.discountPercentage}% OFF`}
                                            </span>
                                        </div>
                                        <div className={`text-xs rounded-full px-2 py-1 ${
                                            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {new Date(coupon.expiryDate) > new Date() ? 
                                                `Expires in ${Math.ceil((new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days` : 
                                                'Expires today'}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-lg mb-1">{coupon.code}</h3>
                                                <p className={`text-sm line-clamp-2 ${
                                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                    {coupon.description || `Save with this special offer!`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`p-3 mb-4 rounded ${
                                            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
                                        }`}>
                                            <div className="flex justify-between text-sm">
                                                <span>Minimum order: </span>
                                                <span className="font-medium">₹100</span>
                                            </div>
                                            {coupon.maxDiscount && (
                                                <div className="flex justify-between text-sm mt-1">
                                                    <span>Max discount:</span>
                                                    <span className="font-medium">₹{coupon.maxDiscount}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-xs flex items-center ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                <FiClock className="mr-1" />
                                                Valid till: {new Date(coupon.expiryDate).toLocaleDateString()}
                                            </span>
                                            <button
                                                onClick={() => handleCopyClick(coupon._id, coupon.code)}
                                                className={`flex items-center text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                                                    copiedCouponId === coupon._id
                                                        ? (theme === 'dark' ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800')
                                                        : (theme === 'dark' ? 'bg-purple-800 text-purple-100 hover:bg-purple-700' : 'bg-purple-100 text-purple-800 hover:bg-purple-200')
                                                }`}
                                            >
                                                {copiedCouponId === coupon._id ? (
                                                    <><FiCheck className="mr-1" /> Copied</>
                                                ) : (
                                                    <><FiClipboard className="mr-1" /> Copy Code</>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {/* Decorative element */}
                                    <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                        <div className={`-rotate-45 transform origin-top-right w-24 text-center ${
                                            new Date(coupon.expiryDate) < new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000))
                                                ? (theme === 'dark' ? 'bg-red-600' : 'bg-red-500')
                                                : (theme === 'dark' ? 'bg-green-600' : 'bg-green-500')
                                        } text-white text-xs py-1 absolute top-0 right-0`}>
                                            {new Date(coupon.expiryDate) < new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000))
                                                ? 'ENDING SOON'
                                                : 'ACTIVE'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-16 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                            <FiTag className={`mx-auto mb-3 text-5xl ${
                                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                            }`} />
                            <p className="text-xl font-medium">No coupons available right now</p>
                            <p className={`text-sm mt-2 max-w-md mx-auto ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Check back soon! We're always adding new special offers and discounts for you.
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Restaurants Section */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <FiMapPin className={`mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
                            <h2 className="text-2xl font-bold">Popular Restaurants</h2>
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className={`text-center py-16 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                        }`}>
                            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
                            <p className="mt-4">Discovering restaurants near you...</p>
                        </div>
                    ) : filteredRestaurants.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {filteredRestaurants.map((restaurant, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleRestaurantClick(restaurant._id)}
                                    className={`relative group cursor-pointer rounded-xl overflow-hidden shadow-md transform hover:shadow-xl transition-all ${
                                        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                                    }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={restaurant.profilePic || 'https://via.placeholder.com/400x200'}
                                            alt={restaurant.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="absolute top-0 right-0 m-3">
                                            <div className={`flex items-center px-2 py-1 rounded ${
                                                theme === 'dark' ? 'bg-gray-800 bg-opacity-90' : 'bg-white bg-opacity-90'
                                            }`}>
                                                <FiStar className="text-yellow-400 mr-1" />
                                                <span className="font-bold">{restaurant.rating || '4.5'}</span>
                                            </div>
                                        </div>
                                        <div className={`absolute bottom-0 left-0 right-0 ${
                                            theme === 'dark' ? 'bg-gradient-to-t from-gray-900 to-transparent' : 'bg-gradient-to-t from-black to-transparent'
                                        } h-24 opacity-60`}></div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation();
                                                    // Add favorite logic here
                                                }}
                                                className={`text-gray-400 hover:${theme === 'dark' ? 'text-red-400' : 'text-red-500'} transition-colors`}
                                            >
                                                <FiHeart />
                                            </button>
                                        </div>
                                        <p className={`text-sm line-clamp-2 mb-3 ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {restaurant.description || 'Delicious food made with fresh ingredients, ready for delivery to your door.'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <FiClock className="mr-1 text-sm" />
                                                <span className="text-sm">{restaurant.deliveryTime || '30-40 min'}</span>
                                            </div>
                                            <span className={`text-sm px-2 py-1 rounded ${
                                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}>
                                                Min ₹{restaurant.minOrder || '100'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                            View Menu
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={`text-center py-16 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                            <FiMapPin className={`mx-auto mb-3 text-5xl ${
                                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                            }`} />
                            <p className="text-xl font-medium">No restaurants found</p>
                            <p className={`text-sm mt-2 max-w-md mx-auto ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                                Try adjusting your search or filters to find what you're looking for
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Popular Dishes Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <FiShoppingCart className={`mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
                            <h2 className="text-2xl font-bold">Popular Dishes</h2>
                        </div>
                        
                        <div className={`w-64 relative ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm`}>
                            <input
                                type="text"
                                placeholder="Search dishes..."
                                value={searchdishQuery}
                                onChange={(e) => setSearchdishQuery(e.target.value)}
                                className={`w-full p-2 pl-9 rounded-lg outline-none ${
                                    theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
                                }`}
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-8">Loading dishes...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {filtereddishes.map((dish, index) => (
                                <div key={index} className={`relative group rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform ${
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                }`}>
                                    <img
                                        src={dish.itemPic || 'https://via.placeholder.com/200x200'}
                                        alt={dish.name}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-3">
                                        <h3 className="font-medium text-sm mb-1 line-clamp-1">{dish.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">₹{dish.price}</span>
                                            <div className="flex items-center">
                                                <FiStar className="text-yellow-400 mr-1 text-sm" />
                                                <span className="text-sm">{dish.rating || '4.2'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(dish._id);
                                            }}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            <ToastContainer 
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    );
};

export default UserHome;
