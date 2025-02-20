// layouts/DeliveryLayout.js
import React,{useState} from 'react';
import { Outlet } from 'react-router-dom';
import DeliveryHeader from '../components/Delivery/DeliveryHeader';
import Footer from '../components/Main/Footer';

const DeliveryLayout = () => {
   const [isOpen,setIsOpen]=useState(false)
    const toggleDropdown = () => {
      setIsOpen(false);
    };
  return (
    <div className="flex flex-col min-h-screen">
      <DeliveryHeader isOpen={isOpen} setIsOpen={setIsOpen}  />
      <main className="flex-grow mt-16" onClick={toggleDropdown}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryLayout;
