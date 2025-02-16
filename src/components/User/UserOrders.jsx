
import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { axiosInstance } from '../../utils/axios';
import io from 'socket.io-client';
import { 
  ShoppingBag, 
  Clock, 
  CreditCard, 
  AlertCircle,
  RefreshCw,
  XCircle
} from 'lucide-react';

// Initialize socket connection
const socket = io(import.meta.env.VITE_BASE_URL);

const UserOrders = () => {
  const { theme } = useContext(ThemeContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = new URLSearchParams(window.location.search);
  const userId = params.get('user_id');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        const response = await axiosInstance.get(`/user/orders/${userId}`);
        
        // Ensure we're getting an array of orders
        const ordersData = response.data.orders || response.data || [];
        
        // Check if ordersData is an array, if not convert it to an array if possible
        setOrders(Array.isArray(ordersData) ? ordersData : Object.values(ordersData));
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load your orders. Please try again later.');
        // Initialize with empty array on error
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }

    // Set up socket.io listener for real-time order updates
    socket.on('orderStatusUpdated', (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.off('orderStatusUpdated');
    };
  }, [userId]);

  // Safely filter orders, ensuring orders is an array
  const activeOrders = Array.isArray(orders) 
    ? orders.filter(order => 
        order.status === 'Placed' || 
        order.status === 'Preparing' || 
        order.status === 'Out for Delivery'
      )
    : [];
  
  const completedOrders = Array.isArray(orders)
    ? orders.filter(order => order.status === 'Delivered')
    : [];

  // Handle canceling an order
  const handleCancelOrder = async (orderId) => {
    try {
      // Send cancel request to the backend
      await axiosInstance.post(`/orders/${orderId}/cancel`);

      // Update the local state
      setOrders(
        orders.map(order => 
          order._id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );

      // Success notification
      alert('Order cancelled successfully');
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  // Helper function to safely get nested object property
  const getNested = (obj, path, fallback = '') => {
    try {
      return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : null, obj) || fallback;
    } catch (e) {
      return fallback;
    }
  };

  // Get appropriate status badge
  const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
      switch (status) {
        case 'Placed':
          return {
            color: theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
            icon: <Clock size={16} className="mr-1" />
          };
        case 'Preparing':
          return {
            color: theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
            icon: <ShoppingBag size={16} className="mr-1" />
          };
        case 'Out for Delivery':
          return {
            color: theme === 'dark' ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800',
            icon: <ShoppingBag size={16} className="mr-1" />
          };
        case 'Delivered':
          return {
            color: theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
            icon: <ShoppingBag size={16} className="mr-1" />
          };
        case 'Cancelled':
          return {
            color: theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
            icon: <XCircle size={16} className="mr-1" />
          };
        default:
          return {
            color: theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800',
            icon: <ShoppingBag size={16} className="mr-1" />
          };
      }
    };

    const { color, icon } = getStatusConfig(status);

    return (
      <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {status}
      </span>
    );
  };

  // Render order item
  const renderOrderItem = (order, canCancel = false) => {
    return (
      <li
        key={order._id}
        className={`mb-6 rounded-xl overflow-hidden transition transform hover:translate-y-[-2px] ${
          theme === 'dark' 
            ? 'bg-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
            : 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
        }`}
      >
        <div className="p-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-grow space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">
                  {getNested(order, 'restaurant_id.name', 'Restaurant Name Not Available')}
                </h3>
                <StatusBadge status={order.status} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center text-sm">
                  <Clock size={16} className={`mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {new Date(order.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center text-sm">
                  <CreditCard size={16} className={`mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    {order.paymentMethod || 'Not specified'}
                  </span>
                </div>
              </div>

              <div>
                <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Order Items:
                </p>
                <ul className={`pl-0 text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {order.items && Array.isArray(order.items) ? (
                    order.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>
                          {getNested(item, 'item_id.name') || item.name || 'Item Name Not Available'} × {item.quantity || 1}
                        </span>
                        <span className="font-medium">
                          Rs-{(item.price || 0).toFixed(2)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li>Order details not available</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <div className={`mt-4 pt-4 border-t flex flex-wrap justify-between items-center ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="font-medium">
              <span className="text-sm mr-1">Total:</span>
              <span className="text-lg">
                Rs-{(order.totalPrice || order.total || 0).toFixed(2)}
              </span>
            </div>
            
            {canCancel && (
              <button
                onClick={() => handleCancelOrder(order._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm flex items-center"
              >
                <XCircle size={16} className="mr-1" />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </li>
    );
  };

  if (loading) {
    return (
      <div className={`max-w-4xl mx-auto py-12 px-4 text-center ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        <div className="animate-spin mb-4 mx-auto">
          <RefreshCw size={32} />
        </div>
        <p className="text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`max-w-4xl mx-auto py-12 px-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        <div className={`rounded-xl shadow-lg p-8 text-center ${
          theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <AlertCircle size={48} className={`mb-4 mx-auto ${
            theme === 'dark' ? 'text-red-400' : 'text-red-500'
          }`} />
          <h2 className="text-xl font-semibold mb-2">Unable to Load Orders</h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-5xl mx-auto py-8 px-4 sm:px-6 ${
      theme === 'dark' ? 'text-white' : 'text-gray-800'
    }`}>
      <div className={`rounded-xl overflow-hidden shadow-lg ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`px-6 py-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="text-2xl font-bold text-center mb-2">Your Orders</h2>
          <p className={`text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Manage and track all your food orders
          </p>
        </div>

        <div className="p-6">
          {/* Active Orders Section */}
          <div className="mb-10">
            <div className="flex items-center mb-6">
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Active Orders
              </h3>
              <div className={`ml-3 px-2.5 py-1 rounded text-xs font-medium ${
                theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
              }`}>
                {activeOrders.length}
              </div>
            </div>
            
            {activeOrders.length === 0 ? (
              <div className={`rounded-lg p-8 text-center ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  You don't have any active orders at the moment
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {activeOrders.map((order) => {
                  const orderTime = new Date(order.createdAt);
                  const currentTime = new Date();
                  const timeDifference = Math.floor((currentTime - orderTime) / 1000);
                  const canCancel = timeDifference <= 60 && order.status === 'Placed';

                  return renderOrderItem(order, canCancel);
                })}
              </ul>
            )}
          </div>

          {/* Completed Orders Section */}
          <div>
            <div className="flex items-center mb-6">
              <h3 className={`text-xl font-semibold ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Order History
              </h3>
              <div className={`ml-3 px-2.5 py-1 rounded text-xs font-medium ${
                theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
              }`}>
                {completedOrders.length}
              </div>
            </div>
            
            {completedOrders.length === 0 ? (
              <div className={`rounded-lg p-8 text-center ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <p className={`${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  You don't have any completed orders yet
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {completedOrders.map((order) => renderOrderItem(order))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
// import React, { useEffect, useState, useContext } from 'react';
// import { ThemeContext } from '../../context/ThemeContext';
// import { axiosInstance } from '../../utils/axios';
// import { 
//   ShoppingBag, 
//   Clock, 
//   CreditCard, 
//   AlertCircle,
//   RefreshCw,
//   XCircle
// } from 'lucide-react';

// const UserOrders = () => {
//   const { theme } = useContext(ThemeContext);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const params = new URLSearchParams(window.location.search);
//   const userId = params.get('user_id');
  
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
        
//         const response = await axiosInstance.get(`/user/orders/${userId}`);
        
//         // Ensure we're getting an array of orders
//         const ordersData = response.data.orders || response.data || [];
        
//         // Check if ordersData is an array, if not convert it to an array if possible
//         setOrders(Array.isArray(ordersData) ? ordersData : Object.values(ordersData));
//         setError(null);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//         setError('Failed to load your orders. Please try again later.');
//         // Initialize with empty array on error
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchOrders();
//     }
//   }, [userId]);

//   // Safely filter orders, ensuring orders is an array
//   const activeOrders = Array.isArray(orders) 
//     ? orders.filter(order => 
//         order.status === 'Placed' || 
//         order.status === 'Preparing' || 
//         order.status === 'Out for Delivery'
//       )
//     : [];
  
//   const completedOrders = Array.isArray(orders)
//     ? orders.filter(order => order.status === 'Delivered')
//     : [];

//   // Handle canceling an order
//   const handleCancelOrder = async (orderId) => {
//     try {
//       // Send cancel request to the backend
//       await axiosInstance.post(`/orders/${orderId}/cancel`);

//       // Update the local state
//       setOrders(
//         orders.map(order => 
//           order._id === orderId ? { ...order, status: 'Cancelled' } : order
//         )
//       );

//       // Success notification
//       alert('Order cancelled successfully');
//     } catch (error) {
//       console.error('Error canceling order:', error);
//       alert('Failed to cancel order. Please try again.');
//     }
//   };

//   // Helper function to safely get nested object property
//   const getNested = (obj, path, fallback = '') => {
//     try {
//       return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : null, obj) || fallback;
//     } catch (e) {
//       return fallback;
//     }
//   };

//   // Get appropriate status badge
//   const StatusBadge = ({ status }) => {
//     const getStatusConfig = (status) => {
//       switch (status) {
//         case 'Placed':
//           return {
//             color: theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800',
//             icon: <Clock size={16} className="mr-1" />
//           };
//         case 'Preparing':
//           return {
//             color: theme === 'dark' ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800',
//             icon: <ShoppingBag size={16} className="mr-1" />
//           };
//         case 'Out for Delivery':
//           return {
//             color: theme === 'dark' ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800',
//             icon: <ShoppingBag size={16} className="mr-1" />
//           };
//         case 'Delivered':
//           return {
//             color: theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800',
//             icon: <ShoppingBag size={16} className="mr-1" />
//           };
//         case 'Cancelled':
//           return {
//             color: theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800',
//             icon: <XCircle size={16} className="mr-1" />
//           };
//         default:
//           return {
//             color: theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800',
//             icon: <ShoppingBag size={16} className="mr-1" />
//           };
//       }
//     };

//     const { color, icon } = getStatusConfig(status);

//     return (
//       <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
//         {icon}
//         {status}
//       </span>
//     );
//   };

//   // Render order item
//   const renderOrderItem = (order, canCancel = false) => {
//     return (
//       <li
//         key={order._id}
//         className={`mb-6 rounded-xl overflow-hidden transition transform hover:translate-y-[-2px] ${
//           theme === 'dark' 
//             ? 'bg-gray-800 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' 
//             : 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
//         }`}
//       >
//         <div className="p-5">
//           <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
//             <div className="flex-grow space-y-4">
//               <div className="flex justify-between items-start">
//                 <h3 className="font-semibold text-lg">
//                   {getNested(order, 'restaurant_id.name', 'Restaurant Name Not Available')}
//                 </h3>
//                 <StatusBadge status={order.status} />
//               </div>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div className="flex items-center text-sm">
//                   <Clock size={16} className={`mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
//                   <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
//                     {new Date(order.createdAt).toLocaleString(undefined, {
//                       month: 'short',
//                       day: 'numeric',
//                       year: 'numeric',
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </span>
//                 </div>
                
//                 <div className="flex items-center text-sm">
//                   <CreditCard size={16} className={`mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
//                   <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
//                     {order.paymentMethod || 'Not specified'}
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
//                   Order Items:
//                 </p>
//                 <ul className={`pl-0 text-sm space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
//                   {order.items && Array.isArray(order.items) ? (
//                     order.items.map((item, index) => (
//                       <li key={index} className="flex justify-between">
//                         <span>
//                           {getNested(item, 'item_id.name') || item.name || 'Item Name Not Available'} × {item.quantity || 1}
//                         </span>
//                         <span className="font-medium">
//                           Rs-{(item.price || 0).toFixed(2)}
//                         </span>
//                       </li>
//                     ))
//                   ) : (
//                     <li>Order details not available</li>
//                   )}
//                 </ul>
//               </div>
//             </div>
//           </div>
          
//           <div className={`mt-4 pt-4 border-t flex flex-wrap justify-between items-center ${
//             theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
//           }`}>
//             <div className="font-medium">
//               <span className="text-sm mr-1">Total:</span>
//               <span className="text-lg">
//                 Rs-{(order.totalPrice || order.total || 0).toFixed(2)}
//               </span>
//             </div>
            
//             {canCancel && (
//               <button
//                 onClick={() => handleCancelOrder(order._id)}
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm flex items-center"
//               >
//                 <XCircle size={16} className="mr-1" />
//                 Cancel Order
//               </button>
//             )}
//           </div>
//         </div>
//       </li>
//     );
//   };

//   if (loading) {
//     return (
//       <div className={`max-w-4xl mx-auto py-12 px-4 text-center ${
//         theme === 'dark' ? 'text-white' : 'text-gray-800'
//       }`}>
//         <div className="animate-spin mb-4 mx-auto">
//           <RefreshCw size={32} />
//         </div>
//         <p className="text-lg">Loading your orders...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`max-w-4xl mx-auto py-12 px-4 ${
//         theme === 'dark' ? 'text-white' : 'text-gray-800'
//       }`}>
//         <div className={`rounded-xl shadow-lg p-8 text-center ${
//           theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'
//         }`}>
//           <AlertCircle size={48} className={`mb-4 mx-auto ${
//             theme === 'dark' ? 'text-red-400' : 'text-red-500'
//           }`} />
//           <h2 className="text-xl font-semibold mb-2">Unable to Load Orders</h2>
//           <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition flex items-center mx-auto"
//           >
//             <RefreshCw size={16} className="mr-2" />
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`max-w-5xl mx-auto py-8 px-4 sm:px-6 ${
//       theme === 'dark' ? 'text-white' : 'text-gray-800'
//     }`}>
//       <div className={`rounded-xl overflow-hidden shadow-lg ${
//         theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
//       }`}>
//         <div className={`px-6 py-8 ${
//           theme === 'dark' ? 'bg-gray-800' : 'bg-white'
//         }`}>
//           <h2 className="text-2xl font-bold text-center mb-2">Your Orders</h2>
//           <p className={`text-center ${
//             theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//           }`}>
//             Manage and track all your food orders
//           </p>
//         </div>

//         <div className="p-6">
//           {/* Active Orders Section */}
//           <div className="mb-10">
//             <div className="flex items-center mb-6">
//               <h3 className={`text-xl font-semibold ${
//                 theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//               }`}>
//                 Active Orders
//               </h3>
//               <div className={`ml-3 px-2.5 py-1 rounded text-xs font-medium ${
//                 theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
//               }`}>
//                 {activeOrders.length}
//               </div>
//             </div>
            
//             {activeOrders.length === 0 ? (
//               <div className={`rounded-lg p-8 text-center ${
//                 theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
//               }`}>
//                 <p className={`${
//                   theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                 }`}>
//                   You don't have any active orders at the moment
//                 </p>
//               </div>
//             ) : (
//               <ul className="space-y-4">
//                 {activeOrders.map((order) => {
//                   const orderTime = new Date(order.createdAt);
//                   const currentTime = new Date();
//                   const timeDifference = Math.floor((currentTime - orderTime) / 1000);
//                   const canCancel = timeDifference <= 60 && order.status === 'Placed';

//                   return renderOrderItem(order, canCancel);
//                 })}
//               </ul>
//             )}
//           </div>

//           {/* Completed Orders Section */}
//           <div>
//             <div className="flex items-center mb-6">
//               <h3 className={`text-xl font-semibold ${
//                 theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//               }`}>
//                 Order History
//               </h3>
//               <div className={`ml-3 px-2.5 py-1 rounded text-xs font-medium ${
//                 theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
//               }`}>
//                 {completedOrders.length}
//               </div>
//             </div>
            
//             {completedOrders.length === 0 ? (
//               <div className={`rounded-lg p-8 text-center ${
//                 theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
//               }`}>
//                 <p className={`${
//                   theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                 }`}>
//                   You don't have any completed orders yet
//                 </p>
//               </div>
//             ) : (
//               <ul className="space-y-4">
//                 {completedOrders.map((order) => renderOrderItem(order))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserOrders;
