import React, { useState, useEffect, useContext } from "react";
import { axiosInstance } from '../../utils/axios';
import io from 'socket.io-client';
import { useLocation } from "react-router-dom";
import { ThemeContext } from '../../context/ThemeContext';

// Create socket connection with the server
const socket = io(import.meta.env.VITE_BASE_URL);

// Helper function to safely get order ID
const getOrderId = (order) => {
  return order._id || order.orderId || "unknown";
};

// Helper function to safely get a short ID
const getShortId = (order, length = 6) => {
  const id = getOrderId(order);
  return typeof id === 'string' && id.length > length
    ? id.substring(id.length - length)
    : id;
};

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const delivery_id = searchParams.get("delivery_id");
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchOrders();

    // Listen for order status updates from Socket.IO
    socket.on('orderStatusUpdated', (updatedOrder) => {
      console.log("Received updated order via socket:", updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          getOrderId(order) === getOrderId(updatedOrder) ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off('orderStatusUpdated');
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders assigned to the delivery person
      const response = await axiosInstance.get(`/orders/delivery-orders`, {
        params: { delivery_id }, // Pass delivery_id as a query parameter
      });

      if (response.data.success) {
        console.log("Orders fetched successfully:", response.data.data);
        setOrders(response.data.data);
      } else {
        setError("Failed to fetch orders. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An error occurred while fetching orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (order, newStatus) => {
    const orderId = getOrderId(order);
    try {
      // Emit the status update to the server via Socket.IO
      socket.emit('updateOrderStatus', { 
        orderId, 
        newStatus
      });

      // Optimistically update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          getOrderId(order) === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert(`Order marked as ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("An error occurred while updating the order. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
  };

  if (loading) {
    return (
      <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center text-red-500 py-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        {error}
        <button
          onClick={fetchOrders}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Separate active and completed orders
  const activeOrders = orders.filter((order) => 
    order.status === "Assigned to Delivery Boy" || order.status === "Out for Delivery"
  );
  const completedOrders = orders.filter((order) => order.status === "Delivered");

  return (
    <div className={`p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <h1 className={`text-2xl md:text-3xl font-bold text-center mb-8 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>
        Delivery Orders
      </h1>

      {/* Active Orders Section */}
      <div className="mb-12">
        <h2 className={`text-xl md:text-2xl font-bold mb-4 ${
          theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
        }`}>
          Active Orders ({activeOrders.length})
        </h2>

        {activeOrders.length === 0 ? (
          <div className={`text-center py-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No active orders at the moment
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {activeOrders.map((order) => (
              <div 
                key={getOrderId(order)} 
                className={`rounded-lg overflow-hidden border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-purple-900 shadow-lg' 
                    : 'bg-white border-purple-100 shadow-lg'
                }`}
              >
                <div className={`p-4 ${
                  theme === 'dark' ? 'bg-purple-900' : 'bg-purple-50 border-b border-purple-100'
                }`}>
                  <div className="flex justify-between items-center">
                    <h3 className={`font-bold text-lg ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      Order #{getShortId(order, 6)}
                    </h3>
                    <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <p className="mb-2"><span className="font-semibold">Customer:</span> {order.customer?.name || "N/A"}</p>
                  <p className="mb-2"><span className="font-semibold">Phone:</span> {order.customer?.phone || "N/A"}</p>
                  <p className="mb-2"><span className="font-semibold">Address:</span> {order.customer?.address || "N/A"}</p>
                  <p className="mb-2"><span className="font-semibold">Payment:</span> {order.paymentMethod || "N/A"}</p>
                  <p className="mb-2"><span className="font-semibold">Restaurant:</span> {order.restaurant?.name || "N/A"}</p>
                  <p className="mb-4"><span className="font-semibold">Total:</span> ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}</p>


                  {order.status === "Assigned to Delivery Boy" && (
                    <button
                      onClick={() => updateStatus(order, "Out for Delivery")}
                      className="w-full py-2 mb-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition"
                    >
                      Start Delivery
                    </button>
                  )}
                  
                  <button
                    onClick={() => updateStatus(order, "Delivered")}
                    className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition"
                  >
                    Mark as Delivered
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders Section */}
      <div>
        <h2 className={`text-xl md:text-2xl font-bold mb-4 ${
          theme === 'dark' ? 'text-green-400' : 'text-green-600'
        }`}>
          Completed Orders ({completedOrders.length})
        </h2>

        {completedOrders.length === 0 ? (
          <div className={`text-center py-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No completed orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`min-w-full rounded-lg overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <thead className={theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'}>
                <tr>
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Restaurant</th>
                  <th className="py-3 px-4 text-left">Address</th>
                  <th className="py-3 px-4 text-left">Payment</th>
                  <th className="py-3 px-4 text-left">Total</th>
                  {/* <th className="py-3 px-4 text-left">Items</th> */}
                </tr>
              </thead>
              <tbody className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                {completedOrders.map((order) => (
                  <tr key={getOrderId(order)} className={`border-b ${
                    theme === 'dark' ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-200'
                  } transition`}>
                    <td className="py-3 px-4 truncate" title={getOrderId(order)}>
                      <span className="font-mono">
                        {getShortId(order, 8)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.customer?.name || "N/A"}</td>
                    <td className="py-3 px-4">{order.restaurant?.name || "N/A"}</td>
                    <td className="py-3 px-4 max-w-xs truncate" title={order.customer?.address}>
                      {order.customer?.address || "N/A"}
                    </td>
                    <td className="py-3 px-4">{order.paymentMethod || "N/A"}</td>
                    <td className="py-3 px-4">
                      ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOrders;
