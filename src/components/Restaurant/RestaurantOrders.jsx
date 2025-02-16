import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from '../../utils/axios';
import io from 'socket.io-client';

// Create socket connection with the server
const socket = io(import.meta.env.VITE_BASE_URL);

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurant_id");

  const orderStatuses = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

  useEffect(() => {
    fetchOrders();

    // Listen for order status updates from Socket.IO
    socket.on('orderStatusUpdated', (updatedOrder) => {
      console.log("Received updated order via socket:", updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off('orderStatusUpdated');
    };
  }, [restaurantId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch orders for the restaurant
      const response = await axiosInstance.get(`/orders/restaurant-orders/${restaurantId}`);

      if (response.data.success) {
        setOrders(response.data.data);
        console.log("Fetched orders:", response.data.data);
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

  const assignDeliveryPerson = async (orderId) => {
    try {
      const response = await axiosInstance.put('/orders/assign-delivery', { orderId });

      if (response.data.success) {
        console.log("Delivery person assigned successfully:", response.data.data);
        return response.data; // Return the response for success check
      } else {
        console.error("Failed to assign delivery person:", response.data.message);
        return null; // Return null if assignment failed
      }
    } catch (error) {
      console.error("Error assigning delivery person:", error);
      return null; // Return null if an error occurred
    }
  };

  const updateStatus = async (id, currentStatus) => {
    let newStatus = "";
    if (currentStatus === "Placed") newStatus = "Preparing";
    else if (currentStatus === "Preparing") newStatus = "Out for Delivery";

    if (!newStatus) return;

    try {
      // If the new status is "Out for Delivery", assign a delivery person first
      if (newStatus === "Out for Delivery") {
        const assignResponse = await assignDeliveryPerson(id);

        // Only proceed with status update if delivery person assignment was successful
        if (assignResponse && assignResponse.success) {
          // Emit the status update to the server via Socket.IO
          socket.emit('updateOrderStatus', { orderId: id, newStatus });
        } else {
          console.error("Failed to assign delivery person. Status not updated.");
          return;
        }
      } else {
        // For other status updates, emit the status update directly
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
                {/* Only show Actions column for Placed and Preparing statuses */}
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
                    ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
                  </td>
                  <td className="py-3 px-4">
                    {order.paymentMethod || "N/A"}
                  </td>
                  {/* Only show action buttons for Placed and Preparing statuses */}
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

  // Group orders by status
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
    </div>
  );
};

export default RestaurantOrders;
// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { axiosInstance } from '../../utils/axios';
// import io from 'socket.io-client';

// // Create socket connection with the server
// const socket = io(import.meta.env.VITE_BASE_URL);

// const RestaurantOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchParams] = useSearchParams();
//   const restaurantId = searchParams.get("restaurant_id");

//   const orderStatuses = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

//   useEffect(() => {
//     fetchOrders();

//     // Listen for order status updates from Socket.IO
//     socket.on('orderStatusUpdated', (updatedOrder) => {
//       console.log("Received updated order via socket:", updatedOrder);
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === updatedOrder._id ? updatedOrder : order
//         )
//       );
//     });

//     return () => {
//       socket.off('orderStatusUpdated');
//     };
//   }, [restaurantId]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch orders for the restaurant
//       const response = await axiosInstance.get(`/orders/restaurant-orders/${restaurantId}`);

//       if (response.data.success) {
//         setOrders(response.data.data);
//         console.log("Fetched orders:", response.data.data);
//       } else {
//         setError("Failed to fetch orders. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError("An error occurred while fetching orders. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const assignDeliveryPerson = async (orderId) => {
//     try {
//       // Assign a delivery person to the order
//       const response = await axiosInstance.put('/orders/assign-delivery', { orderId });

//       if (response.data.success) {
//         console.log("Delivery person assigned successfully:", response.data.data);
//       } else {
//         console.error("Failed to assign delivery person:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Error assigning delivery person:", error);
//     }
//   };

//   const updateStatus = async (id, currentStatus) => {
//     let newStatus = "";
//     if (currentStatus === "Placed") newStatus = "Preparing";
//     else if (currentStatus === "Preparing") newStatus = "Out for Delivery";

//     if (!newStatus) return;

//     try {
//       // Emit the status update to the server via Socket.IO
//       socket.emit('updateOrderStatus', { orderId: id, newStatus });

//       // Call the assign delivery API when status changes to "Out for Delivery"
//       if (newStatus === "Out for Delivery") {
//         await assignDeliveryPerson(id);
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString();
//   };

//   const renderOrderTable = (filteredOrders, statusTitle) => {
//     if (filteredOrders.length === 0) return null;

//     return (
//       <div className="mb-8">
//         <h2 className={`text-2xl font-bold mb-4 ${
//           statusTitle === "Placed" ? "text-yellow-500" :
//           statusTitle === "Preparing" ? "text-blue-500" :
//           statusTitle === "Out for Delivery" ? "text-purple-500" :
//           "text-green-500"
//         }`}>
//           {statusTitle} Orders ({filteredOrders.length})
//         </h2>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="py-3 px-4 text-left w-24">Order ID</th>
//                 <th className="py-3 px-4 text-left">Customer</th>
//                 <th className="py-3 px-4 text-left">Date</th>
//                 <th className="py-3 px-4 text-left">Address</th>
//                 <th className="py-3 px-4 text-left">Items</th>
//                 <th className="py-3 px-4 text-left">Total</th>
//                 <th className="py-3 px-4 text-left">Payment</th>
//                 {/* Only show Actions column for Placed and Preparing statuses */}
//                 {(statusTitle === "Placed" || statusTitle === "Preparing") && (
//                   <th className="py-3 px-4 text-left">Actions</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <tr key={order._id} className="border-b hover:bg-gray-50 transition">
//                   <td className="py-3 px-4 truncate" title={order._id}>
//                     <span className="font-mono">
//                       {order._id.substring(order._id.length - 8)}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">{order.user_id?.name || "N/A"}</td>
//                   <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
//                   <td className="py-3 px-4 max-w-xs truncate" title={order.address}>
//                     {order.address || "N/A"}
//                   </td>
//                   <td className="py-3 px-4 max-w-xs">
//                     <div className="max-h-20 overflow-y-auto">
//                       {order.items && order.items.length > 0 ? (
//                         order.items.map((item, index) => (
//                           <div key={index} className="mb-1">
//                             {item?.item_id?.name || "Unknown Item"} x{item?.quantity || 1}
//                           </div>
//                         ))
//                       ) : (
//                         "No items"
//                       )}
//                     </div>
//                   </td>
//                   <td className="py-3 px-4">
//                     ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}
//                   </td>
//                   <td className="py-3 px-4">
//                     {order.paymentMethod || "N/A"}
//                   </td>
//                   {/* Only show action buttons for Placed and Preparing statuses */}
//                   {(order.status === "Placed" || order.status === "Preparing") && (
//                     <td className="py-3 px-4">
//                       <button
//                         onClick={() => updateStatus(order._id, order.status)}
//                         className={`text-white px-4 py-2 rounded-md transition ${
//                           order.status === "Placed" ? "bg-blue-500 hover:bg-blue-600" :
//                           "bg-purple-500 hover:bg-purple-600"
//                         }`}
//                       >
//                         {order.status === "Placed"
//                           ? "Start Preparing"
//                           : "Out for Delivery"}
//                       </button>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return <div className="text-center py-4">Loading orders...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500 py-4">{error}</div>;
//   }

//   // Group orders by status
//   const getOrdersByStatus = (status) => {
//     return orders.filter(order => order.status === status);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
//         Restaurant Orders
//       </h1>

//       {orderStatuses.map(status => 
//         renderOrderTable(getOrdersByStatus(status), status)
//       )}
      
//       {orders.length === 0 && (
//         <div className="text-center text-gray-500 py-8">
//           No orders found for this restaurant
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestaurantOrders;
