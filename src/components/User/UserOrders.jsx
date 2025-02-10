import React, { useEffect, useState } from 'react';
// import axios from 'axios';

const UserOrders = () => {
  const [orders, setOrders] = useState(
     [
        {
          _id: "order1",
          restaurantName: "The Pizza Place",
          status: "pending",
          createdAt: new Date("2025-01-29T12:45:00Z"),  // Order placed at 12:45 PM
          total: 25.50,
          items: [
            { name: "Margherita Pizza", quantity: 1, price: 15.00 },
            { name: "Garlic Bread", quantity: 1, price: 5.00 },
            { name: "Soft Drink", quantity: 1, price: 5.50 }
          ],
          userId: "user1",  // Assuming user1 is the logged-in user
        },
        {
          _id: "order2",
          restaurantName: "Sushi World",
          status: "on the way",
          createdAt: new Date("2025-01-29T13:05:00Z"),  // Order placed at 1:05 PM
          total: 40.00,
          items: [
            { name: "Salmon Sushi", quantity: 5, price: 25.00 },
            { name: "Maki Rolls", quantity: 2, price: 10.00 },
            { name: "Miso Soup", quantity: 1, price: 5.00 }
          ],
          userId: "user2",
        },
        {
          _id: "order3",
          restaurantName: "Burger King",
          status: "delivered",
          createdAt: new Date("2025-01-28T11:30:00Z"),  // Order placed at 11:30 AM
          total: 18.00,
          items: [
            { name: "Whopper", quantity: 1, price: 9.00 },
            { name: "Fries", quantity: 1, price: 3.00 },
            { name: "Soft Drink", quantity: 1, price: 6.00 }
          ],
          userId: "user3",
        }
      ]
      
  );
  const [cancelTimeouts, setCancelTimeouts] = useState({});

//   useEffect(() => {
//     // Fetch the orders from the API
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get('/api/orders'); // Replace with your actual API endpoint
//         setOrders(response.data);
//       } catch (error) {
//         console.error('Error fetching orders:', error);
//       }
//     };

//     fetchOrders();
//   }, []);

  // Handle canceling an order
//   const handleCancelOrder = async (orderId) => {
//     try {
//       // Send cancel request to the backend
//       await axios.delete(`/api/orders/${orderId}`);

//       // Remove the order from the local state
//       setOrders(orders.filter(order => order._id !== orderId));

//       // Optionally, add some notification or alert for successful cancellation
//       alert('Order cancelled successfully');
//     } catch (error) {
//       console.error('Error canceling order:', error);
//     }
//   };

  // Render the orders with cancel button visible for 1 minute after creation
  return (
    <div className="  overflow-scroll ">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Your Orders</h2>

        <div>
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <ul>
              {orders.map((order) => {
                const orderTime = new Date(order.createdAt);
                const currentTime = new Date();
                const timeDifference = Math.floor((currentTime - orderTime) / 1000); // in seconds

                // Cancel button should be visible for 1 minute (60 seconds)
                const canCancel = timeDifference <= 60;

                return (
                  <li key={order._id} className="mb-4 p-4 border-b border-gray-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{order.restaurantName}</h3>
                        <p>Status: {order.status}</p>
                        <p>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
                      </div>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
