import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Users, ShoppingBag, Truck, BarChart, TrendingUp, Clock } from 'lucide-react';
import {axiosInstance} from '../../utils/axios'

const StatCard = ({ icon: Icon, title, value, change, timeframe, color, onClick }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div 
      className={`rounded-xl p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg transition-transform hover:scale-105 cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className={`h-8 w-8 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className={`flex items-center space-x-1 text-sm ${
          change >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          <TrendingUp className={`h-4 w-4 ${change >= 0 ? '' : 'transform rotate-180'}`} />
          <span>{Math.abs(change)}%</span>
        </span>
      </div>
      
      <div className="mt-4">
        <h3 className={`text-sm font-medium ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {title}
        </h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{timeframe}</span>
        </div>
      </div>
    </div>
  );
};

const ListDisplay = ({ title, data, theme }) => {
  return (
    <div className={`mt-8 p-6 rounded-xl ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-lg`}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className={`p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-500">{item.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminUserHome = () => {
  const { theme } = useContext(ThemeContext);
  const [stats, setStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showRestaurants, setShowRestaurants] = useState(false);
  const [showDeliveryPartners, setShowDeliveryPartners] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axiosInstance.get('/admin/userfetch');
        const restaurantsResponse = await axiosInstance.get('/admin/resfetch');
        const deliveryPartnersResponse = await axiosInstance.get('/admin/deliveryfetch');
        const ordersResponse = await axiosInstance.get('/admin/ordersfetch');

        setUsers(usersResponse.data.data);
        setRestaurants(restaurantsResponse.data.data);
        setDeliveryPartners(deliveryPartnersResponse.data.data);

        setStats([
          {
            icon: Users,
            title: 'Total Users',
            value: usersResponse.data.data.length,
            change: 12.5,
            timeframe: 'Last 30 days',
            color: 'bg-blue-500',
            onClick: () => setShowUsers(!showUsers)
          },
          {
            icon: ShoppingBag,
            title: 'Active Restaurants',
            value: restaurantsResponse.data.data.length,
            change: 8.2,
            timeframe: 'Last 30 days',
            color: 'bg-green-500',
            onClick: () => setShowRestaurants(!showRestaurants)
          },
          {
            icon: Truck,
            title: 'Delivery Partners',
            value: deliveryPartnersResponse.data.data.length,
            change: -2.4,
            timeframe: 'Last 30 days',
            color: 'bg-purple-500',
            onClick: () => setShowDeliveryPartners(!showDeliveryPartners)
          },
          {
            icon: BarChart,
            title: 'Total Orders',
            value: ordersResponse.data.data.length,
            change: 15.6,
            timeframe: 'Last 30 days',
            color: 'bg-yellow-500'
          }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`min-h-screen pt-24 px-4 sm:px-6 lg:px-8 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold"
            style={{
              fontFamily: 'Pacifico, cursive',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
            Dashboard Overview
          </h1>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        
        {showUsers && <ListDisplay title="Users List" data={users} theme={theme} />}
        {showRestaurants && <ListDisplay title="Restaurants List" data={restaurants} theme={theme} />}
        {showDeliveryPartners && <ListDisplay title="Delivery Partners List" data={deliveryPartners} theme={theme} />}

        {/* Quick Actions */}
        <div className={`mt-8 p-6 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className={`p-4 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              View All Users
            </button>
            <button className={`p-4 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              Manage Restaurants
            </button>
            <button className={`p-4 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-50 hover:bg-gray-100'
            }`}>
              Track Deliveries
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserHome;

