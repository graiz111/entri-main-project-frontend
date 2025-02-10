// layouts/MainLayout.js
import React ,{useState}from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Main/Header";
import Footer from "../components/Main/Footer";

const MainLayout = () => {
  const [isOpen,setIsOpen]=useState(false)
  const toggleDropdown = () => {
    setIsOpen(false);
  };

  return (
    <>
    <div className="flex flex-col min-h-screen ">
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-grow mt-28" onClick={toggleDropdown}>
        <Outlet />
      </main>
      <Footer/>
      </div>
    </>
  );
};

export default MainLayout;
