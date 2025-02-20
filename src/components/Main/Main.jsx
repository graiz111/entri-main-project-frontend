import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ThemeContext } from '../../context/ThemeContext'
import { FaUtensils, FaTruck, FaHeadset, FaTag, FaCopy } from 'react-icons/fa'
import userpic from '../../assets/userpic.jpg'
import respic1 from '../../assets/respic1.avif'
import respic2 from '../../assets/respic2.avif'
import respic3 from '../../assets/respic3.avif'

const Main = () => {
  const { theme } = useContext(ThemeContext);
  const [coupons, setCoupons] = useState([          { id: 1, code: 'WELCOME25', discount: '25% Off', minOrder: 500, validity: '31 May 2025' },
                                                    { id: 2, code: 'FREESHIP', discount: 'Free Delivery', minOrder: 300, validity: '15 Mar 2025' },
                                                    { id: 3, code: 'FOOD10', discount: '10% Off', minOrder: 200, validity: '10 Apr 2025' }]);
  const [copied, setCopied] = useState(null);



  const handleCopyClick = (id, code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(id);
        setTimeout(() => setCopied(null), 2000); 
      })
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>

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
      
      <div className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-50'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <FaTag className={`text-2xl mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              Special Offers For You
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div 
                key={coupon.id} 
                className={`rounded-lg shadow-md overflow-hidden transition transform hover:shadow-lg
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
              >
                <div className={`p-4 ${theme === 'dark' ? 'bg-green-700' : 'bg-green-500'} text-white`}>
                  <h3 className="text-xl font-bold">{coupon.discount}</h3>
                  <p className="text-sm opacity-90">Min. Order: ₹{coupon.minOrder}</p>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Valid till: {coupon.validity}
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-3">
                    <div 
                      className={`flex-1 text-center py-2 px-3 rounded-l-md border border-r-0
                        ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                    >
                      <span className="font-mono font-semibold">{coupon.code}</span>
                    </div>
                    <button
                      onClick={() => handleCopyClick(coupon.id, coupon.code)}
                      className={`flex items-center justify-center p-2 rounded-r-md transition
                        ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}
                        text-white`}
                    >
                      {copied === coupon.id ? 'Copied!' : <FaCopy />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
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
