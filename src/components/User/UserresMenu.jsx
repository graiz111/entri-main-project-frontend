import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from "../../context/ThemeContext";
import { FiShoppingCart, FiStar, FiArrowLeft } from 'react-icons/fi';
import { useNavigate,useLocation, useParams } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import { ToastContainer,toast } from 'react-toastify';

const UseresMenu = () => {
  const{restaurant_id,_id}=useParams()
  
        
   
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cartTotal, setCartTotal] = useState(0);
    
     useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const restaurantResponse = await axiosInstance.get(`/restaurant/getsingleres/${restaurant_id}`);
                setRestaurant(restaurantResponse.data.data);

                const menuResponse = await axiosInstance.get(`/restaurantadd/getallitemsuser/${restaurant_id}`);
                setMenuItems(menuResponse.data.data);
                (menuResponse.data.data);
                
            } catch (error) {
                console.error('Error fetching restaurant data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [restaurant_id]);

    useEffect(() => {
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setCartTotal(total);
    }, [cart]);

    const addToCart = async (item_id) => {
        try {
            
            const resResponse = await axiosInstance.post("restaurantadd/fetchresid", { itemId: item_id });
      
    
            if (resResponse.data.success === true) {
                const postData = {
                    user_id: _id,                                
                    restaurant_id: restaurant_id, 
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
            toast.error("error happeed in cart add");
        }
    };
    
  

    

    const categories = ['all', ...new Set(menuItems.map(item => item.category))];

    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
            }`}>
                Loading...
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${
            theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
        }`}>
            <div className={`w-full py-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="container mx-auto px-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mb-4 text-purple-600 hover:text-purple-700"
                    >
                        <FiArrowLeft /> Back to Restaurants
                    </button>
                    
                    {restaurant && (
                        <div className="flex flex-col md:flex-row gap-6">
                            <img
                                src={restaurant.profilePic || 'https://via.placeholder.com/200x200'}
                                alt={restaurant.name}
                                className="w-full md:w-64 h-48 object-cover rounded-lg"
                            />
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                                <p className="opacity-75 mb-4">{restaurant.description}</p>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center">
                                        <FiStar className="text-yellow-400 mr-1" />
                                        {restaurant.rating || '4.5'}
                                    </span>
                                    <span>•</span>
                                    <span>{restaurant.deliveryTime || '30-40 min'}</span>
                                    <span>•</span>
                                    <span>Min order: {restaurant.minOrder || '100/-'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
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

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className={`p-4 rounded-lg ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            } shadow-md`}
                        >
                            <img
                                src={item.itemPic || 'https://via.placeholder.com/300x200'}
                                alt={item.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <div className="flex items-center">
                                    <FiStar className="text-yellow-400 mr-1" />
                                    <span>{item.rating || '4.5'}</span>
                                </div>
                            </div>
                            <p className="text-sm opacity-75 mb-4">{item.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="font-bold">${item.price}</span>
                                <button
                                    onClick={() => addToCart(item._id)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {cart.length > 0 && (
                <div className={`fixed bottom-0 left-0 right-0 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg p-4 border-t ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <FiShoppingCart className="text-purple-600" size={24} />
                                <div>
                                    <span className="font-bold">{cart.length} items</span>
                                    <span className="mx-2">•</span>
                                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/checkout')}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </div>
    );
};

export default UseresMenu;