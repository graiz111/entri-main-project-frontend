// layouts/UserLayout.js
import React,{useState,useEffect} from 'react';
import { Outlet, useLocation } from "react-router-dom";
import UserHeader from '../components/User/UserHeader';
import Footer from '../components/Main/Footer';
import { axiosInstance } from '../utils/axios';
import { useParams } from "react-router-dom";



const UserLayout = () => {
   const [isOpen,setIsOpen]=useState(false)
   const [User, setUser] = useState({})
  const{_id,role}=useParams()


   
    const toggleDropdown = () => {
      setIsOpen(false);
    };
   
  
  const fetchUserDetails = async (role, _id) => {
    console.log(role,_id,"hereuser");
    
    try {
      const response = await axiosInstance.get(`/${role}/user/${_id}`, {
        
      });
  
      if (response.data.success) {
        console.log(response.data.data,"inlayoutfetch");
        
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
    <div className="flex flex-col min-h-screen">
      <UserHeader isOpen={isOpen} setIsOpen={setIsOpen} profilepic={User.profilePic} _id={User._id} role={User.role} />
      <main className="flex-grow mt-20 " onClick={toggleDropdown}>
        <Outlet _id={User._id} />
      </main> 
      <Footer />
    </div>
  );
};

export default UserLayout;

