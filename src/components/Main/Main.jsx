import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import { FaUtensils, FaTruck, FaHeadset } from 'react-icons/fa'

import userpic from '../../assets/userpic.jpg'
import respic1 from '../../assets/respic1.avif'
import respic2 from '../../assets/respic2.avif'
import respic3 from '../../assets/respic3.avif'

const Main = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 gap-10 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img 
            src={userpic} 
            alt="Foodie Buddie" 
            className="rounded-xl shadow-lg w-full max-h-[500px] object-cover"
          />
        </div>
        
        <div className="md:w-1/2 text-center md:text-left space-y-4">
          <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            Foodie Buddie
          </h1>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
            Bringing delicious meals to your doorstep with just a few clicks
          </p>
          <div className="space-y-2">
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Discover, Order, Enjoy</p>
            <NavLink 
              to="/signup?role=user" 
              className={`inline-block px-6 py-3 rounded-full 
              hover:opacity-90 transition duration-300 shadow-md
              ${theme === 'dark' 
                ? 'bg-green-700 text-white' 
                : 'bg-green-500 text-white'}`}
            >
              Start Ordering Now
            </NavLink>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Why Choose Foodie Buddie?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaUtensils className={`text-5xl mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />,
                title: "Millions of Users",
                description: "Trusted by food lovers across the country",
                image: respic1
              },
              {
                icon: <FaTruck className={`text-5xl mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />,
                title: "Doorstep Delivery",
                description: "Enjoy your favorite meals without leaving home",
                image: respic2
              },
              {
                icon: <FaHeadset className={`text-5xl mb-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />,
                title: "24/7 Support",
                description: "Our team is always ready to assist you",
                image: respic3
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`rounded-xl shadow-md p-6 text-center 
                transition transform hover:scale-105 hover:shadow-lg
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
              >
                {feature.icon}
                <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {feature.title}
                </h3>
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="mx-auto h-24 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
