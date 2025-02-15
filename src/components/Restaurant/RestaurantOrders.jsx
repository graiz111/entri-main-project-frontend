import React, { useState, useEffect } from "react";
import axios from "axios";

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const restaurantId = "your-restaurant-id"; // Replace with actual restaurant ID

  // Fetch Orders from Backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/orders/restaurant-orders/${restaurantId}`,
        { withCredentials: true }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Function to Update Order Status in Backend
  const updateStatus = async (id, currentStatus) => {
    let newStatus = "";
    if (currentStatus === "Placed") newStatus = "Preparing";
    else if (currentStatus === "Preparing") newStatus = "Out for Delivery";
    else if (currentStatus === "Out for Delivery") newStatus = "Delivered";

    if (!newStatus) return;

    try {
      await axios.put(
        `http://localhost:5001/api/orders/update-status/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );

      // Update local state after successful API response
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Orders
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Items</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">{order._id}</td>
                <td className="py-3 px-4">{order.user_id?.name || "N/A"}</td>
                <td className="py-3 px-4">{order.address}</td>
                <td className="py-3 px-4">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {item.item.name} x{item.quantity}
                      {index !== order.items.length - 1 && ", "}
                    </span>
                  ))}
                </td>
                <td className="py-3 px-4">${order.totalPrice.toFixed(2)}</td>
                <td
                  className={`py-3 px-4 font-semibold ${
                    order.status === "Placed"
                      ? "text-yellow-500"
                      : order.status === "Preparing"
                      ? "text-blue-500"
                      : order.status === "Out for Delivery"
                      ? "text-purple-500"
                      : "text-green-500"
                  }`}
                >
                  {order.status}
                </td>
                <td className="py-3 px-4">
                  {order.status !== "Delivered" && (
                    <button
                      onClick={() => updateStatus(order._id, order.status)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                    >
                      {order.status === "Placed"
                        ? "Start Preparing"
                        : order.status === "Preparing"
                        ? "Out for Delivery"
                        : "Mark as Delivered"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantOrders;
