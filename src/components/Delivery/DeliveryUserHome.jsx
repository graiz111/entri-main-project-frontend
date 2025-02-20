import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { 
  FaMotorcycle, FaMapMarkedAlt, FaHistory, 
  FaMoneyBillWave, FaUser, FaBell, FaSignOutAlt,
  FaTachometerAlt, FaClipboardList, FaClock,
  FaChevronRight, FaPhoneAlt
} from 'react-icons/fa';
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axios.js"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import respic3 from '../../assets/respic3.avif';

const DeliveryUserHome = ({ name, userId }) => {
  const { _id, role } = useParams(); 
  const { theme } = useContext(ThemeContext);
  const [isOnline, setIsOnline] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/delivery/currentstatus`, {
          params: { _id: _id }
        });
        
        if (response.data.success) {
          setIsOnline(response.data.isDelivery);
        } else {
          toast.error(response.data.message || "Failed to fetch status");
        }
      } catch (error) {
        console.error("Error fetching delivery status:", error);
        toast.error("Failed to fetch delivery status");
      } finally {
        setIsLoading(false);
      }
    };

    if (_id) {
      fetchStatus();
    }
  }, [_id]);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const newStatus = !isOnline;
      
      const response = await axiosInstance.put("/delivery/update-status", {
        userId: _id,
        status: newStatus ? "online" : "offline"
      });

      if (response.data.success) {
        setIsOnline(newStatus);
        toast.success(`Status updated to ${newStatus ? 'online' : 'offline'}`);
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update delivery status");
     
      setIsOnline(!isOnline);
    } finally {
      setIsLoading(false);
    }
  };

  const userData = {
    name: "John Smith",
    rating: 4.8,
    totalDeliveries: 328,
    todayEarnings: 85.50,
    weeklyEarnings: 560.25,
    profilePic: respic3
  };

  const currentDeliveries = [
    {
      id: "ORD39485",
      restaurant: "Spice Garden",
      customerName: "Emma Wilson",
      address: "123 Main St, Apt 4B",
      time: "Pickup in 5 mins",
      amount: 18.75,
      status: "Ready for pickup"
    }
  ];

  const pastDeliveries = [
    {
      id: "ORD39484",
      restaurant: "Burger King",
      customerName: "Michael Johnson",
      time: "Today, 12:30 PM",
      amount: 22.50,
      status: "Completed"
    },
    {
      id: "ORD39483",
      restaurant: "Pizza Palace",
      customerName: "Sarah Brown",
      time: "Today, 11:45 AM",
      amount: 32.95,
      status: "Completed"
    },
    {
      id: "ORD39482",
      restaurant: "Taco Heaven",
      customerName: "David Lee",
      time: "Today, 10:15 AM",
      amount: 15.25,
      status: "Completed"
    }
  ];

  return (
    <div className={`flex flex-col  ${theme === 'dark' ? 'bg-gray-900 text-white' : 'text-gray-800'}`}>
     
 

      <div className="flex-1 container mx-auto relative">
     
        <main className="p-4 md:p-6">
      
          <div className={`p-4 rounded-lg shadow-md mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Welcome back, {name}!</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isOnline ? 'You are currently accepting orders' : 'You are currently offline'}
                </p>
              </div>
              <div className="flex items-center">
                <span className={`mr-2 ${
                  isOnline ? "text-green-500" : theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>
                  {isLoading ? "Updating..." : isOnline ? "Online" : "Offline"}
                </span>
                <button
                  onClick={handleToggle}
                  disabled={isLoading}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isOnline ? "bg-green-500 justify-end" : theme === "dark" ? "bg-gray-600 justify-start" : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                    isLoading ? "animate-pulse" : ""
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Today's Earnings</p>
                  <h3 className="text-2xl font-semibold">Rs-{userData.todayEarnings.toFixed(2)}</h3>
                </div>
                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}`}>
                  <FaMoneyBillWave className={theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} size={20} />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>This Week</p>
                  <h3 className="text-2xl font-semibold">Rs-{userData.weeklyEarnings.toFixed(2)}</h3>
                </div>
                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}`}>
                  <FaClipboardList className={theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} size={20} />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Deliveries</p>
                  <h3 className="text-2xl font-semibold">{userData.totalDeliveries}</h3>
                </div>
                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}`}>
                  <FaMotorcycle className={theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} size={20} />
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Rating</p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-semibold mr-1">{userData.rating}</h3>
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-100'}`}>
                  <FaUser className={theme === 'dark' ? 'text-orange-400' : 'text-orange-500'} size={20} />
                </div>
              </div>
            </div>
          </div>

         
          <div className={`p-4 rounded-lg shadow-md mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Current Deliveries</h2>
            
            {currentDeliveries.length > 0 ? (
              <div className="space-y-4">
                {currentDeliveries.map((delivery) => (
                  <div 
                    key={delivery.id}
                    className={`p-4 rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center">
                          <span className="font-semibold">{delivery.restaurant}</span>
                          <span className={`text-xs px-2 py-1 rounded ml-2 ${theme === 'dark' ? 'bg-orange-800 text-orange-200' : 'bg-orange-200 text-orange-800'}`}>
                            {delivery.status}
                          </span>
                        </div>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Order #{delivery.id}
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0">
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                          Rs-{delivery.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-3 sm:mb-0">
                        <p className="text-sm font-medium">Customer: {delivery.customerName}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {delivery.address}
                        </p>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                          {delivery.time}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button className={`px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-600 hover:bg-orange-700'} text-white`}>
                          Accept
                        </button>
                        <button className={`px-3 py-2 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} text-white`}>
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <p className="text-lg">No active deliveries at the moment</p>
                {!isOnline && (
                  <p className="mt-2 text-sm">Go online to start receiving order requests</p>
                )}
              </div>
            )}
          </div>

     
          <div className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold mb-4">Recent Deliveries</h2>
            
            <div className="overflow-x-auto">               <table className="min-w-full divide-y divide-gray-700">                 <thead>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                      Order
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>                       Customer
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                      Time                     </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                      Amount
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {pastDeliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">{delivery.restaurant}</div>
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              #{delivery.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm">{delivery.customerName}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {delivery.time}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        Rs-{delivery.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          delivery.status === 'Completed' 
                            ? theme === 'dark' 
                              ? 'bg-green-900 text-green-200' 
                              : 'bg-green-100 text-green-800'
                            : theme === 'dark'
                              ? 'bg-yellow-900 text-yellow-200'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-center">
              <a 
                href="#" 
                className={`text-sm font-medium ${theme === 'dark' ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}
              >
                View All Deliveries
              </a>
            </div>
          </div>
        </main>
        
        
        <button className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg ${theme === 'dark' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-600 hover:bg-orange-700'} text-white z-10`}>
          <FaPhoneAlt />
        </button>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default DeliveryUserHome;
