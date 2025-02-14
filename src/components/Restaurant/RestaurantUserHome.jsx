
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import respic from '../../assets/respic.avif';
import respic1 from '../../assets/respic1.avif';
import respic2 from '../../assets/respic2.avif';
import respic3 from '../../assets/respic3.avif';
import { ThemeContext } from '../../context/ThemeContext';



const FeatureCard = ({ image, title, description, theme }) => (
  <div className={`flex flex-col items-center p-6 rounded-xl transition-all transform hover:scale-105 ${
    theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
  } shadow-lg max-w-sm`}>
    <img src={image} alt={title} className="h-24 mb-4 object-contain" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
      {description}
    </p>
  </div>
);

const RestaurantUserHome = () => {

 const { theme } = useContext(ThemeContext);



  const features = [
    {
      image: respic1,
      title: "Attract New Customers",
      description: "Reach the millions of peoples ordering on Foodie Buddie"
    },
    {
      image: respic2,
      title: "Door Step Delivery",
      description: "Easy to deliver your food by our partners"
    },
    {
      image: respic3,
      title: "All Time Support",
      description: "Ready to assist on calls on time"
    }
  ];

  return (
    <div className={`flex-grow  container pb-9 pt-5 mx-auto ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`}>
      <section className={`${
        theme === 'dark' ? 'bg-gray-800' : 'bg-orange-100'
      } py-20 rounded-3xl`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <img
                src={respic}
                alt="Restaurant Hero"
                className="rounded-2xl shadow-2xl max-w-full h-auto"
              />
            </div>
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to
                <span className="block text-orange-500 mt-2">Foodie Buddie</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                We are here to make delicious for our kings...!
              </p>
            
              
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Should You Partner With Foodie Buddie?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                image={feature.image}
                title={feature.title}
                description={feature.description}
                theme={theme}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-orange-50'
      }`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Grow Your Restaurant Business?
          </h2>
          
        </div>
      </section>
    </div>
  );
};

export default RestaurantUserHome;













































