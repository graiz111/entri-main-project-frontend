import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "../../context/ThemeContext";
import { FiClock, FiStar, FiSearch, FiShoppingCart } from 'react-icons/fi';

import { axiosInstance } from '../../utils/axios';

const UserHome = () => {
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const{_id,role}=useParams()
 
    
    const [restaurants, setRestaurants] = useState([]);
    const [popularDishes, setPopularDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchdishQuery, setSearchdishQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);

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
            console.log("Fetched Restaurant ID Response:", resResponse.data);
    
            if (resResponse.data.success === true) {
                const postData = {
                    user_id: _id,                                 // User ID
                    restaurant_id: resResponse.data.restaurant_id, // Extracted Restaurant ID
                    item_id: item_id
                };
    
                console.log("Post Data for Cart:", postData);
    
                // Add item to cart
                const cartResponse = await axiosInstance.post("cart/additemtocart", postData);
    
                if (cartResponse.data.success === true) {
                    toast.success("Item added to cart!");
                    console.log("Cart Response:", cartResponse.data);
                } else {
                    toast.error("Failed to add item to cart!");
                }
            } else {
                toast.error("Failed to fetch restaurant ID!");
            }
    
        } catch (error) {
            console.error("Error in addToCart:", error);
            toast.error("error happeed in cart add");
        }
    };
    

    const handleRestaurantClick = (restaurantsId) => {
        navigate(`userresmenu/${restaurantsId}/${_id}`);
    };

    return (
        <div className={`min-h-screen ${
            theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
        }`}>
            <div className={`w-full py-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                <div className='container mx-auto px-4'>
                    <div className='flex flex-col md:flex-row gap-4 mb-8'>
                        <div className={`flex-1 relative ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm`}>
                            <input
                                type="text"
                                placeholder="Search restaurants..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full p-3 pl-10 rounded-lg outline-none ${
                                    theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
                                }`}
                            />
                            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        <div className='flex gap-2 overflow-x-auto pb-2'>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition-colors ${
                                        selectedCategory === category
                                            ? 'bg-purple-600 text-white'
                                            : theme === 'dark'
                                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {filteredRestaurants.map((restaurant, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleRestaurantClick(restaurant._id)}
                                    className={`relative group cursor-pointer rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform ${
                                        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'
                                    }`}
                                >
                                    <img
                                        src={restaurant.profilePic || 'https://via.placeholder.com/400x200'}
                                        alt={restaurant.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                                            <div className="flex items-center">
                                                <FiStar className="text-yellow-400 mr-1" />
                                                <span>{restaurant.rating || '4.5'}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm opacity-75 mb-2">{restaurant.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <FiClock className="mr-1" />
                                                <span className="text-sm">{restaurant.deliveryTime || '30-40 min'}</span>
                                            </div>
                                            <span className="text-sm">Min order: {restaurant.minOrder || '100/-'}</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                            View Menu
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                        <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Popular Dishes</h2>
                        <div className={`flex-1 relative ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        } rounded-lg shadow-sm`}>
                            <input
                                type="text"
                                placeholder="Search dishes..."
                                value={searchdishQuery}
                                onChange={(e) => setSearchdishQuery(e.target.value)}
                                className={`w-full p-3 pl-10 rounded-lg outline-none ${
                                    theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
                                }`}
                            />
                            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {popularDishes.map((dish, index) => (
                                <div key={index} className={`relative group rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform ${
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                                }`}>
                                    <img
                                        src={dish.itemPic || 'https://via.placeholder.com/200x200'}
                                        alt={dish.name}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="p-3">
                                        <h3 className="font-medium text-sm mb-1">{dish.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">${dish.price}</span>
                                            <div className="flex items-center">
                                                <FiStar className="text-yellow-400 mr-1 text-sm" />
                                                <span className="text-sm">{dish.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
                        </div>
                </div>
               
    <ToastContainer
/>
            </div>
        </div>
    );
};

export default UserHome;



