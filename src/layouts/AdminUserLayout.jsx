import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AdminUserHeader from '../components/Admin/AdminUserHeader'
import  {axiosInstance}  from '../utils/axios.js';
import { useParams } from "react-router-dom";

const AdminUserLayout = () => {
  const [User, setUser] = useState({})
  const { _id,role } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(false);
  };

  

  const fetchUserDetails = async (role, _id) => {
    (role,_id,"here");
    
    try {
      const response = await axiosInstance.get(`/${role}/users`, {
        params: { _id }, 
        withCredentials: true,
      });
  
      if (response.data.success) {
        (response.data.data,"inadmin layoutfetch");
        
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
      <AdminUserHeader isOpen={isOpen} setIsOpen={setIsOpen} profilePic={User?.profilePic} _id={User?._id} role={User?.role} name={User?.name}/>
      <main className="flex-grow mt-20" onClick={toggleDropdown}>
        <Outlet /> {/* 👈 This renders RestaurantUserHome or other child routes */}
      </main>
     
    </div>
  );
};

export default AdminUserLayout;