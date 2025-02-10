import React,{useState} from 'react'

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([
        {
          id: 1,
          customer: "John Doe",
          address: "123 Main St, New York, NY",
          items: "Burger, Fries",
          total: "$12.99",
          status: "Pending",
        },
        {
          id: 2,
          customer: "Alice Smith",
          address: "456 Oak Ave, Los Angeles, CA",
          items: "Pizza, Soda",
          total: "$15.49",
          status: "Preparing",
        },
        {
          id: 3,
          customer: "Michael Lee",
          address: "789 Pine Rd, Chicago, IL",
          items: "Pasta",
          total: "$9.99",
          status: "Completed",
        },
      ]);
      const updateStatus = (id, newStatus) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, status: newStatus } : order
          )
        );
      };


  return (
    <div className=" p-6 ">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        ORDERS
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
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{order.address}</td>
                    <td className="py-3 px-4">{order.items}</td>
                    <td className="py-3 px-4">{order.total}</td>
                    <td
                        className={`py-3 px-4 font-semibold ${
                        order.status === "Pending"
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
                        {order.status !== "Completed" && (
                        <button
                            onClick={() =>
                            updateStatus(
                                order.id,
                                order.status === "Pending"
                                ? "Preparing"
                                : order.status === "Preparing"
                                ? "Out for Delivery"
                                : "Completed"
                            )
                            }
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                        >
                            {order.status === "Pending"
                            ? "Start Preparing"
                            : order.status === "Preparing"
                            ? "Out for Delivery"
                            : "Mark as Completed"}
                        </button>
                        )}
                    </td>
                    </tr>
                ))}
           </tbody>
        </table>
      </div>
    </div>
  )
}

export default RestaurantOrders