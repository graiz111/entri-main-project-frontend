// layouts/AdminLayout.js
import React,{useState} from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/Admin/AdminHeader';
import Footer from '../components/Main/Footer';

const AdminLayout = () => {
   const [isOpen,setIsOpen]=useState(false)
    const toggleDropdown = () => {
      setIsOpen(false);
    };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-grow mt-28 " onClick={toggleDropdown}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
