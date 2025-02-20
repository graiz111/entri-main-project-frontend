import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

const AboutUs = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`container mx-auto max-w-4xl p-6 sm:p-8 shadow-lg rounded-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <h1
          className={`text-2xl sm:text-3xl font-bold text-center mb-6 ${
            theme === "dark" ? "text-green-400" : "text-green-600"
          }`}
        >
          About Us
        </h1>
        <p className="text-base sm:text-lg mb-4">
          Welcome to <span className="font-semibold">Foodie Buddie</span>, your ultimate destination for delicious meals delivered straight to your doorstep. We are dedicated to bringing you the best food from your favorite local restaurants with a seamless ordering experience.
        </p>
        <h2
          className={`text-xl sm:text-2xl font-semibold mt-6 ${
            theme === "dark" ? "text-green-300" : "text-green-500"
          }`}
        >
          Our Mission
        </h2>
        <p className="mt-2 text-sm sm:text-base">
          At <span className="font-semibold">Foodie Buddie</span>, our mission is to connect food lovers with the best culinary experiences. Whether you crave a quick bite or a gourmet meal, we make it easy for you to satisfy your hunger with just a few clicks.
        </p>
        <h2
          className={`text-xl sm:text-2xl font-semibold mt-6 ${
            theme === "dark" ? "text-green-300" : "text-green-500"
          }`}
        >
          Our Services
        </h2>
        <ul className="list-disc list-inside mt-2 text-sm sm:text-base">
          <li>Fast and reliable food delivery</li>
          <li>Wide variety of restaurants and cuisines</li>
          <li>Secure and easy payment options</li>
          <li>Real-time order tracking</li>
          <li>Dedicated customer support</li>
        </ul>
        <h2
          className={`text-xl sm:text-2xl font-semibold mt-6 ${
            theme === "dark" ? "text-green-300" : "text-green-500"
          }`}
        >
          Join Us
        </h2>
        <p className="mt-2 text-sm sm:text-base">
          Become a part of our growing <span className="font-semibold">Foodie Buddie</span> community. Whether you're a customer, restaurant, or delivery partner, we welcome you to join us in our journey of making food ordering more convenient and enjoyable.
        </p>
       
      </div>
    </div>
  );
};

export default AboutUs;
