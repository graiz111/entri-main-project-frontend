


import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Users, ShoppingBag, Truck, BarChart, TrendingUp, Clock } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, change, timeframe, color }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`rounded-xl p-6 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-lg transition-transform hover:scale-105`}>
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

const AdminUserHome = () => {
  const { theme } = useContext(ThemeContext);
  
  const stats = [
    {
      icon: Users,
      title: 'Total Users',
      value: '1,274',
      change: 12.5,
      timeframe: 'Last 30 days',
      color: 'bg-blue-500'
    },
    {
      icon: ShoppingBag,
      title: 'Active Restaurants',
      value: '348',
      change: 8.2,
      timeframe: 'Last 30 days',
      color: 'bg-green-500'
    },
    {
      icon: Truck,
      title: 'Delivery Partners',
      value: '156',
      change: -2.4,
      timeframe: 'Last 30 days',
      color: 'bg-purple-500'
    },
    {
      icon: BarChart,
      title: 'Total Orders',
      value: '8,942',
      change: 15.6,
      timeframe: 'Last 30 days',
      color: 'bg-yellow-500'
    }
  ];

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