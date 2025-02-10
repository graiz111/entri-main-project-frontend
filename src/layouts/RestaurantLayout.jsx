// layouts/RestaurantLayout.js
import React,{useState} from 'react';
import { Outlet } from 'react-router-dom';
import RestaurantHeader from '../components/Restaurant/RestaurantHeader';
import Footer from '../components/Main/Footer';

const RestaurantLayout = () => {
   const [isOpen,setIsOpen]=useState(false)
    const toggleDropdown = () => {
      setIsOpen(false);
    };
  
  return (
    <div className="flex flex-col min-h-screen">
      <RestaurantHeader isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-grow mt-28" onClick={toggleDropdown}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RestaurantLayout;
