import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaHome, FaCreditCard, FaMoneyBill } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { axiosInstance } from "../../utils/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from '@stripe/stripe-js';



const CheckOut = () => {
  const navigate = useNavigate();
  const { userId,cartId } = useParams();
  const { theme } = useContext(ThemeContext);
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    country: 'India'
  });


  
  useEffect(() => {
    console.log("entered checkout",userId);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch cart
        const cartResponse = await axiosInstance.get(`/cart/cart/${userId}`);
        setCart(cartResponse.data.data);
        
        // Fetch addresses
        const addressResponse  = await axiosInstance.post('/user/addresses', {
                
                user_id: userId 
              });;
              if (addressResponse.data.success && Array.isArray(addressResponse.data.addresses)) {
                setAddresses(addressResponse.data.addresses);}
        
        if (addressResponse.data.addresses && addressResponse.data.addresses.length > 0) {
          setSelectedAddress(addressResponse.data.addresses[0]._id);
        }
      } catch (error) {
        console.error("Error fetching checkout data:", error);
        setError("Failed to load checkout information");
        toast.error("Failed to load checkout information");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addNewAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/user/addresses', {
        action: 'add',
        user_id: userId,
        ...newAddress
      });
  
      if (response.data.success) {
        toast.success("Address added successfully");
        // Update addresses list and select the new address
        setAddresses(prev => [...prev, response.data.address]);
        setSelectedAddress(response.data.address._id);
        setShowNewAddressForm(false);
        // Reset form
        setNewAddress({
          address_line_1: '',
          address_line_2: '',
          city: '',
          state: '',
          postal_code: '',
          phone: '',
          country: 'India'
        });
      } else {
        toast.error(response.data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    }
  };

  const handlePlaceOrder = async () => {
      
      console.log(cart.items,"items");
    
    
  
    if (!selectedAddress) {
      toast.error("Please select or add an address");
      return;
    }
  
    try {
      if (paymentMethod === "card") {
        try {
            const stripe = await loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);
          
            const response = await axiosInstance.post("/payment/create-checkout-session", {
              userId: userId, // Pass the user ID
              cartId: cart._id,
              addressId: selectedAddress,
              amount: cart.totalPrice,
              items: cart.items,
            });
          
            console.log(response.data, "=======session");
            const result = await stripe.redirectToCheckout({
              sessionId: response.data.sessionId,
            });
          
            if (result.error) {
              console.log(result.error);
            //   toast.error("Payment failed. Please try again.");
            }
          } catch (error) {
            console.error("Error creating checkout session:", error);
           
          }
      } else {
        // COD order placement
        const response = await axiosInstance.post("/user/order/place", {
          userId,
          cartId: cart._id,
          addressId: selectedAddress,
          paymentMethod: "cod",
          status: "placed",
        });
  
        if (response.data.success) {
          navigate(`/order/success/${response.data.orderId}`);
        } else {
        //   toast.error(response.data.message || "Failed to place order");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
    //   toast.error("Failed to place order");
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center  ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <p className="text-xl mb-4">Your cart is empty</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
        >
          <FaArrowLeft />
          <span>Continue Shopping</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center space-x-2 mb-6 ${
            theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
          }`}
        >
          <FaArrowLeft />
          <span>Back to Cart</span>
        </button>

        <div className={`rounded-xl shadow-md overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            
            {/* Order Summary */}
            <div className={`mb-8 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span>{item.item.name} × {item.quantity}</span>
                    <span>Rs.{(item.item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className={`pt-2 mt-2 border-t ${
                  theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>Rs.{cart.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
              
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label 
                      key={address._id} 
                      className={`flex items-start p-3 rounded-lg cursor-pointer ${
                        selectedAddress === address._id 
                          ? theme === 'dark' 
                            ? 'bg-purple-900 border-purple-700' 
                            : 'bg-purple-100 border-purple-300'
                          : theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-100 hover:bg-gray-200'
                      } border transition-colors`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddress === address._id}
                        onChange={handleAddressChange}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <p className="font-medium">{address.street}</p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{address.country}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className={`mb-3 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>No saved addresses found.</p>
              )}
              
              {showNewAddressForm ? (
                <form onSubmit={addNewAddress} className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="font-semibold mb-3">Add New Address</h3>
                    
                 
                    <div className="mb-4">
                        <label htmlFor="address_line_1" className="block text-sm font-medium mb-1">Address Line 1 *</label>
                        <input
                        id="address_line_1"
                        name="address_line_1"
                        type="text"
                        value={newAddress.address_line_1}
                        onChange={handleInputChange}
                        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="House/Flat No., Building Name, Street"
                        required
                        />
                    </div>
                    
                    
                    <div className="mb-4">
                        <label htmlFor="address_line_2" className="block text-sm font-medium mb-1">Address Line 2</label>
                        <input
                        id="address_line_2"
                        name="address_line_2"
                        type="text"
                        value={newAddress.address_line_2 || ''}
                        onChange={handleInputChange}
                        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="Landmark, Area (Optional)"
                        />
                    </div>
                    
                 
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <label htmlFor="city" className="block text-sm font-medium mb-1">City *</label>
                        <input
                            id="city"
                            name="city"
                            type="text"
                            value={newAddress.city}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            placeholder="City"
                            required
                        />
                        </div>
                        <div>
                        <label htmlFor="state" className="block text-sm font-medium mb-1">State *</label>
                        <input
                            id="state"
                            name="state"
                            type="text"
                            value={newAddress.state}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            placeholder="State"
                            required
                        />
                        </div>
                    </div>
                    
                    
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <label htmlFor="postal_code" className="block text-sm font-medium mb-1">Postal Code *</label>
                        <input
                            id="postal_code"
                            name="postal_code"
                            type="text"
                            value={newAddress.postal_code}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            placeholder="Postal Code"
                            required
                        />
                        </div>
                        <div>
                        <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
                        <input
                            id="country"
                            name="country"
                            type="text"
                            value={newAddress.country}
                            onChange={handleInputChange}
                            className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                            disabled
                        />
                        </div>
                    </div>
                
                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number *</label>
                        <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={newAddress.phone}
                        onChange={handleInputChange}
                        className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        placeholder="Phone Number"
                        required
                        />
                    </div>
                   
                    <div className="flex space-x-3 mt-4">
                        <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded font-medium transition-colors"
                        >
                        Save Address
                        </button>
                        <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className={`py-2 px-4 rounded font-medium transition-colors ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                        >
                        Cancel
                        </button>
                    </div>
                </form>
            
              ) : (
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className={`mt-3 flex items-center space-x-2 ${
                    theme === 'dark'
                      ? 'text-purple-400 hover:text-purple-300'
                      : 'text-purple-600 hover:text-purple-800'
                  }`}
                >
                  <FaHome />
                  <span>Add New Address</span>
                </button>
              )}
            </div>
            
            {/* Payment Method */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
              <div className="space-y-3">
                <label 
                  className={`flex items-center p-3 rounded-lg cursor-pointer border ${
                    paymentMethod === 'cod'
                      ? theme === 'dark'
                        ? 'bg-purple-900 border-purple-700'
                        : 'bg-purple-100 border-purple-300'
                      : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                  } transition-colors`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => handlePaymentMethodChange('cod')}
                    className="mr-3"
                  />
                  <FaMoneyBill className="mr-2" />
                  <span>Cash on Delivery</span>
                </label>
                
                <label 
                  className={`flex items-center p-3 rounded-lg cursor-pointer border ${
                    paymentMethod === 'card'
                      ? theme === 'dark'
                        ? 'bg-purple-900 border-purple-700'
                        : 'bg-purple-100 border-purple-300'
                      : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 border-gray-600'
                        : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                  } transition-colors`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => handlePaymentMethodChange('card')}
                    className="mr-3"
                  />
                  <FaCreditCard className="mr-2" />
                  <span>Credit/Debit Card (Stripe)</span>
                </label>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={!selectedAddress}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                !selectedAddress
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {paymentMethod === 'card' ? 'Proceed to Payment' : 'Place Order'}
            </button>
            
            {!selectedAddress && (
              <p className="mt-2 text-sm text-red-500">Please select or add an address to continue</p>
            )}
          </div>
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

export default CheckOut;