import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { axiosInstance } from '../utils/axios';
import { useParams } from "react-router-dom";
import DeliveryUserHeader from "../components/Delivery/DeliveryUserHeader";

const DeliveryUserLayout = () => {
  const [User, setUser] = useState({})
  const { _id,role } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(false);
  };

  

  const fetchUserDetails = async (role, _id) => {
    (role,_id,"here");
    
    try {
      const response = await axiosInstance.get(`/${role}/getdeliveryboy/${_id}`, {
        withCredentials: true,
      });
  
      if (response.data.success) {
        (response.data.data,"in delivery layoutfetch ");
        
        setUser(response.data.data)
      } else {
        throw new Error(response.data.message || "Failed to fetch user details.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw new Error(error.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(()=>{
    fetchUserDetails(role,_id)

  },[])
  


  return (
    <div className="flex flex-col ">
      <DeliveryUserHeader isOpen={isOpen} setIsOpen={setIsOpen} profilePic={User?.profilePic} _id={User?._id} role={User?.role} name={User?.name}/>
      <main className="flex-grow " onClick={toggleDropdown}>
        <Outlet name={User?.name}/> {/* 👈 This renders RestaurantUserHome or other child routes */}
      </main>
     
    </div>
  );
};

export default DeliveryUserLayout;