import React, { useContext } from 'react';
// import { } from 'framer-;
import { FiArrowRight, FiMapPin, FiClock, FiPhoneCall } from 'react-icons/fi';
import { BiMoney } from 'react-icons/bi';
import { MdRestaurant, MdDeliveryDining } from 'react-icons/md';
import { ThemeContext } from '../../context/ThemeContext';
import { Link, Navigate, NavLink, useNavigate } from 'react-router-dom';
import deliverypic1 from '../../assets/deliverypic1.jpeg';
import respic1 from '../../assets/respic1.avif';
import respic2 from '../../assets/respic2.avif';
import respic3 from '../../assets/respic3.avif';

const DeliveryHome = () => {
  const { theme } = useContext(ThemeContext);
  const navigate=useNavigate()


  const handleNavigation = (path) => {
    navigate(path);
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <div className={`flex-grow ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-slate-50 text-gray-800'} transition-colors duration-300 overflow-auto `}>
      
      {/* Hero Section */}
      <section className={`${theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-purple-600 to-indigo-700'} py-10 relative overflow-hidden`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div 
              className="lg:w-1/2 text-white text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Deliver With <span className="text-yellow-300">Foodie Buddie</span></h1>
              <p className="text-xl mb-8 text-gray-100">Flexible hours. Competitive earnings. Join our team of delivery partners today.</p>
         
            </div>
            
            <div 
              className="lg:w-1/2 mt-8 lg:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={deliverypic1} 
                alt="Delivery Partner" 
                className="mx-auto rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500 max-w-full h-auto"
                style={{maxHeight: '500px'}}
              />
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className={`${theme === 'dark' ? 'fill-gray-900' : 'fill-slate-50'}`}>
            <path d="M0,96L120,85.3C240,75,480,53,720,48C960,43,1200,53,1320,58.7L1440,64L1440,100L1320,100C1200,100,960,100,720,100C480,100,240,100,120,100L0,100Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-slate-50'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Why Partner With Foodie Buddie?
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BiMoney className="h-12 w-12 text-yellow-400" />,
                title: "Competitive Earnings",
                description: "Earn competitive pay with tips, bonuses, and incentives.",
                image: respic1
              },
              {
                icon: <FiClock className="h-12 w-12 text-yellow-400" />,
                title: "Flexible Schedule",
                description: "Work when you want. No minimum hours required.",
                image: respic2
              },
              {
                icon: <FiPhoneCall className="h-12 w-12 text-yellow-400" />,
                title: "24/7 Support",
                description: "Our dedicated team is always ready to assist you.",
                image: respic3
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-200`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6">
                    {benefit.icon}
                  </div>
                  <img src={benefit.image} alt={benefit.title} className="h-24 mb-6 rounded-full shadow-md" />
                  <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {benefit.title}
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <FiMapPin />,
                title: "Accept Orders",
                description: "Receive delivery requests through our app."
              },
              {
                icon: <MdRestaurant />,
                title: "Pickup",
                description: "Collect food from our restaurant partners."
              },
              {
                icon: <MdDeliveryDining />,
                title: "Deliver",
                description: "Safely deliver orders to customers."
              },
              {
                icon: <BiMoney />,
                title: "Get Paid",
                description: "Earn money for each completed delivery."
              }
            ].map((step, index) => (
              <div
                key={index}
                className={`relative ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`text-4xl mb-4 w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 transform -translate-x-4">
                    <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-slate-50'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={`max-w-3xl mx-auto text-center p-8 rounded-2xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Ready to Start Delivering?
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of delivery partners who have already signed up with Foodie Buddie.
            </p>
            <Link to="/delivery/signup?role=delivery">
              <button className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-full font-medium flex items-center justify-center gap-2 mx-auto transition-all duration-200 transform hover:scale-105 shadow-lg">
                Sign Up as Delivery Partner <FiArrowRight />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeliveryHome;