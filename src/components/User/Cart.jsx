import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash, FaTimes } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { axiosInstance } from "../../utils/axios";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { theme } = useContext(ThemeContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/cart/${userId}`);
      setCart(response.data.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to load cart items");
      toast.error("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);
  const addToCart = async (itemId) => {
    try {
      // First fetch restaurant ID
      const resResponse = await axiosInstance.post("restaurantadd/fetchresid", { 
        itemId 
      });

      // if (!resResponse.data.success) {
      //   toast.error("Failed to fetch restaurant information");
      //   return;
      // }

      // Check if cart exists and has items from a different restaurant
      if (cart && cart.items && cart.items.length > 0) {
        if (cart.restaurant_id._id !== resResponse.data.restaurant_id) {
          toast.error("Please add items from the same restaurant only");
          return;
        }
      }

      // Add item to cart
      const cartResponse = await axiosInstance.post("user/additemtocart", {
        user_id: userId,
        restaurant_id: resResponse.data.restaurant_id,
        item_id: itemId
      });

      if (cartResponse.data.success) {
        toast.success("Item added to cart!");
        fetchCart(); // Refresh cart
      } else {
        toast.error(cartResponse.data.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error( "items from same restaurant can oly add to cart  ");
    }
  };

  // const addToCart = async (itemId) => {
  //   try {
  //     // First fetch restaurant ID
  //     const resResponse = await axiosInstance.post("restaurantadd/fetchresid", { 
  //       itemId 
  //     });

  //     if (!resResponse.data.success) {
  //       toast.error("Failed to fetch restaurant information");
  //       return;
  //     }

  //     // Add item to cart
  //     const cartResponse = await axiosInstance.post("user/additemtocart", {
  //       user_id: userId,
  //       restaurant_id: resResponse.data.restaurant_id,
  //       item_id: itemId
  //     });

  //     if (cartResponse.data.success) {
  //       toast.success("Item added to cart!");
  //       fetchCart(); // Refresh cart
  //     } else {
  //       toast.error(cartResponse.data.message || "Failed to add item to cart");
  //     }
  //   } catch (error) {
  //     console.error("Error adding to cart:", error);
  //     toast.error(error.response?.data?.message || "Failed to add item to cart");
  //   }
  // };

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const response = await axiosInstance.put(`/cart/update/${cartItemId}`, {
        userId,
        quantity: newQuantity
      });

      if (response.data.success) {
        fetchCart(); // Refresh cart
      } else {
        toast.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await axiosInstance.delete(`/cart/${cartItemId}`, {
        data: { userId }
      });

      if (response.data.success) {
        fetchCart(); // Refresh cart
        toast.success("Item removed from cart");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <div className={`max-w-lg mx-auto ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } p-4 rounded-xl shadow-md relative`}>
        <button
          onClick={() => navigate(-1)}
          className={`absolute top-4 right-4 ${
            theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-500'
          }`}
        >
          <FaTimes size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Your cart is empty
          </p>
        ) : (
          <>
            {cart.restaurant_id && (
              <div className={`mb-4 p-2 rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className="text-sm">
                  Ordering from: <span className="font-semibold">{cart.restaurant_id.name}</span>
                </p>
              </div>
            )}

            <div className="space-y-4">
              {cart.items.map((cartItem) => (
                <div key={cartItem._id} className={`flex items-center justify-between border-b pb-2 ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <img 
                    src={cartItem.item.itemPic || 'https://via.placeholder.com/100'} 
                    alt={cartItem.item.name} 
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold">{cartItem.item.name}</h3>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      ${cartItem.item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(cartItem._id, Math.max(1, cartItem.quantity - 1))}
                      className={`p-1 rounded-full ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
                      }`}
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="mx-2">{cartItem.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(cartItem._id, cartItem.quantity + 1)}
                      className={`p-1 rounded-full ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200'
                      }`}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(cartItem._id)}
                    className="text-red-500 ml-4 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right">
              <p className="text-lg font-bold">
                Total: ${cart.totalPrice.toFixed(2)}
              </p>
            </div>

            <div className="mt-4">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;