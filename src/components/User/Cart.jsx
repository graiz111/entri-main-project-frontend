import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash, FaTimes } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { axiosInstance } from "../../utils/axios";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [cartId, setcartid] = useState(null);
  const { theme } = useContext(ThemeContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/cart/cart/${userId}`);
      setCart(response.data?.data);
      setcartid(response.data.data?._id);
      setDiscountedTotal(response.data.data?.totalPrice);
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

  const updateQuantity = async (cartItemId, newquantity) => {
    try {
      const response = await axiosInstance.put(`/cart/update/${cartItemId}`, {
        userId,
        quantity: newquantity
      });

      if (response.data.success) {
        fetchCart();
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
      const response = await axiosInstance.delete(`/cart/delete/${cartItemId}`, {
        data: { userId }
      });

      if (response.data.success) {
        fetchCart();
        toast.success("Item removed from cart");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleApplyCoupon = async () => {
    try {
      setCouponError("");
      setCouponSuccess("");
  
     
      const couponResponse = await axiosInstance.post("/admin/couponsvalidate", {
        code: couponCode,
        cartTotal: cart.totalPrice,
      });
  
      ("Coupon Validation Response:", couponResponse.data);
  
      if (couponResponse.data.success) {
        const discount = couponResponse.data.discountPercentage;
        const discountAmount = (cart.totalPrice * discount) / 100;
        const newTotal = cart.totalPrice - discountAmount;
  
        
        const updateResponse = await axiosInstance.put("/cart/updateamount", {
          cartId,
          amount: newTotal,
        });
  
        ("Cart Update Response:", updateResponse.data);
  
        if (updateResponse.data.success) {
          setDiscountedTotal(newTotal);
          setCouponSuccess(`Applied ${discount}% discount`);
          toast.success(`Coupon applied successfully! Saved ₹${discountAmount.toFixed(2)}`);
        } else {
          ("Cart Update Failed:", updateResponse.data.message);
          toast.error(updateResponse.data.message);
        }
      } else {
        ("Coupon Validation Failed:", couponResponse.data.message);
        toast.error(couponResponse.data.message);
      }
    } catch (error) {
      console.error("API Call Failed:", error.response?.data || error.message);
  
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Invalid coupon code or failed to apply discount.");
      }
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
          onClick={() => navigate(`/user/${userId}/user`)}
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
                      Rs.{cartItem.item.price.toFixed(2)}
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

            <div className="mt-6 border-t pt-4">
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className={`flex-1 p-2 rounded-lg ${
                      theme === 'dark' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
                
                {couponError && (
                  <p className="text-red-500 text-sm">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-green-500 text-sm">{couponSuccess}</p>
                )}
              </div>
            </div>

            <div className="mt-4 text-right">
              {discountedTotal !== cart.totalPrice && (
                <p className="text-sm line-through text-gray-500">
                  Original: Rs.{cart.totalPrice.toFixed(2)}
                </p>
              )}
              <p className="text-lg font-bold">
                Total: Rs.{(discountedTotal || cart.totalPrice).toFixed(2)}
              </p>
            </div>

            <div className="mt-4">
              <NavLink to={`/user/${userId}/user/checkout/${userId}/${cartId}`}>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition-colors">
                  Proceed to Checkout
                </button>
              </NavLink>
            </div>
          </>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Cart;
