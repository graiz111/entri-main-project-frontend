// layouts/AdminLayout.js
import React,{useState} from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/Admin/AdminHeader';
import Footer from '../components/Main/Footer';

const AdminLayout = () => {
   const [isOpen,setIsOpen]=useState(false)
     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   
    const toggleDropdown = () => {
      setIsOpen(false);
      setIsMobileMenuOpen(false)
    };
  
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader isOpen={isOpen} setIsOpen={setIsOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} isMobileMenuOpen={isMobileMenuOpen} />
      <main className="flex-grow mt-20 " onClick={toggleDropdown}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
