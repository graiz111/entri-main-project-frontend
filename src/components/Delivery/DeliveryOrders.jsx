import React, { useState } from "react";

const DeliveryOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "John Doe",
      items: [
        { name: "Burger", quantity: 2 },
        { name: "Fries", quantity: 1 },
      ],
      status: "Pending",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      items: [
        { name: "Pizza", quantity: 1 },
        { name: "Soda", quantity: 1 },
      ],
      status: "On the Way",
    },
    // More orders can be added here
  ]);

  // Update order status function
  const updateStatus = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // Completed Orders
  const completedOrders = orders.filter((order) => order.status === "Delivered");

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-24">
        <h2 className="text-3xl font-bold text-center mb-6">Delivery Orders</h2>
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">

        {/* Pending Orders */}
        <div className="space-y-4">
          {orders.filter((order) => order.status !== "Delivered").map((order) => (
            <div key={order.id} className="border-b border-gray-300 py-4">
              <h3 className="text-xl font-semibold">Order #{order.id}</h3>
              <p className="text-lg">Customer: {order.customerName}</p>
              <ul className="mb-4">
                {order.items.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item.quantity} x {item.name}
                  </li>
                ))}
              </ul>

              <p className="text-lg font-medium">Status: {order.status}</p>
              <div className="mt-4">
                {order.status === "Pending" && (
                  <button
                    onClick={() => updateStatus(order.id, "On the Way")}
                    className="mr-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                  >
                    Mark as On the Way
                  </button>
                )}

                {order.status === "On the Way" && (
                  <button
                    onClick={() => updateStatus(order.id, "Delivered")}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                  >
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completed Orders */}
        {completedOrders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-2xl font-semibold mb-4">Completed Orders</h3>
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <div key={order.id} className="border-b border-gray-300 py-4">
                  <h3 className="text-xl font-semibold">Order #{order.id}</h3>
                  <p className="text-lg">Customer: {order.customerName}</p>
                  <ul className="mb-4">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.quantity} x {item.name}
                      </li>
                    ))}
                  </ul>

                  <p className="text-lg font-medium">Status: {order.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryOrders;
