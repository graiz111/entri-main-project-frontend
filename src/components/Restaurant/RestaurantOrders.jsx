
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from '../../utils/axios';
import io from 'socket.io-client';
import { ToastContainer,toast } from "react-toastify";



const socket = io(import.meta.env.VITE_BASE_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurant_id");

  const orderStatuses = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

  useEffect(() => {
    fetchOrders();

    socket.on('orderStatusUpdated', (updatedOrder) => {
      ("Received updated order via socket:", updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });
    // socket.on('orderStatusUpdated', (updatedOrder) => {
    //   ("Received updated order via socket:", updatedOrder);
    //   ("Updated Order ID:", updatedOrder._id);
    //   setOrders((prevOrders) => {
    //     ("Previous Orders:", prevOrders);
    //     return prevOrders.map((order) =>
    //       order._id === updatedOrder._id ? updatedOrder : order
    //     );
    //   });
    // });

    return () => {
      socket.off('orderStatusUpdated');
    };
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(`/orders/delivery-orders`, {
          params: { delivery_id },
        });
      
        if (response.data.success === true) {
          
          setOrders(response.data.data);
          // You could add a success toast here if desired
          // toast.success("Orders fetched successfully");
        } else {
 
          setError(response.data.message || "Failed to fetch orders");
          // You could add an error toast here if desired
          // toast.error(response.data.message);
        }
        
          if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
            // toast.error(error.response.data.message);
          } else {
            setError("Failed to fetch orders. Please try again.");
            // toast.error("Failed to fetch orders. Please try again.");
          }
      } catch (error) {
        console.error("API Call Failed:", error.response?.data || error.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An error occurred while fetching orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const assignDeliveryPerson = async (orderId) => {
  //   try {
  //     const response = await axiosInstance.put('/orders/assign-delivery', { orderId });

  //     if (response.data.success) {
  //       ("Delivery person assigned successfully:", response.data.data);
  //       return response.data; 
  //     } else {
  //       console.error("Failed to assign delivery person:", response.data.message);
  //       return null; 
  //     }
  //   } catch (error) {
  //     console.error("Error assigning delivery person:", error);
  //     return null; 
  //   }
  // };
  const assignDeliveryPerson = async (orderId) => {
    try {
      const response = await axiosInstance.put('/orders/assign-delivery', { orderId });
  
      (response.data, "assignDeliveryResponse");
  
      if (response.data.success === true) {
        toast.success("Delivery person assigned successfully!");
        ("Delivery Person Assigned:", response.data.data);
        return response.data;
      } else {
        ("Error Condition Met");
        ("Error Message:", response.data.message);
        toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      console.error("API Call Failed:", error.response?.data || error.message);
  
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to assign delivery person. Please try again.");
      }
  
      return null;
    }
  };
  

  const updateStatus = async (id, currentStatus) => {
    let newStatus = "";
    if (currentStatus === "Placed") newStatus = "Preparing";
    else if (currentStatus === "Preparing") newStatus = "Out for Delivery";

    if (!newStatus) return;

    try {

      if (newStatus === "Out for Delivery") {
        const assignResponse = await assignDeliveryPerson(id);

       
        if (assignResponse && assignResponse.success) {
        
          socket.emit('updateOrderStatus', { orderId: id, newStatus });
        } else {
          console.error("Failed to assign delivery person. Status not updated.");
          return;
        }
      } else {
        
        socket.emit('updateOrderStatus', { orderId: id, newStatus });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderOrderTable = (filteredOrders, statusTitle) => {
    if (filteredOrders.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 ${
          statusTitle === "Placed" ? "text-yellow-500" :
          statusTitle === "Preparing" ? "text-blue-500" :
          statusTitle === "Out for Delivery" ? "text-purple-500" :
          "text-green-500"
        }`}>
          {statusTitle} Orders ({filteredOrders.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left w-24">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Payment</th>
     
                {(statusTitle === "Placed" || statusTitle === "Preparing") && (
                  <th className="py-3 px-4 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 truncate" title={order._id}>
                    <span className="font-mono">
                      {order._id.substring(order._id.length - 8)}
                    </span>
                  </td>
                  <td className="py-3 px-4">{order.user_id?.name || "N/A"}</td>
                  <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4 max-w-xs truncate" title={order.address}>
                    {order.address || "N/A"}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="max-h-20 overflow-y-auto">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="mb-1">
                            {item?.item_id?.name || "Unknown Item"} x{item?.quantity || 1}
                          </div>
                        ))
                      ) : (
                        "No items"
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    Rs : {order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
                  </td>
                  <td className="py-3 px-4">
                    {order.paymentMethod || "N/A"}
                  </td>

                  {(order.status === "Placed" || order.status === "Preparing") && (
                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateStatus(order._id, order.status)}
                        className={`text-white px-4 py-2 rounded-md transition ${
                          order.status === "Placed" ? "bg-blue-500 hover:bg-blue-600" :
                          "bg-purple-500 hover:bg-purple-600"
                        }`}
                      >
                        {order.status === "Placed"
                          ? "Start Preparing"
                          : "Out for Delivery"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }


  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Restaurant Orders
      </h1>

      {orderStatuses.map(status => 
        renderOrderTable(getOrdersByStatus(status), status)
      )}
      
      {orders.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No orders found for this restaurant
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default RestaurantOrders;
