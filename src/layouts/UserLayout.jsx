// layouts/UserLayout.js
import React,{useState,useEffect} from 'react';
import { Outlet, useLocation } from "react-router-dom";
import UserHeader from '../components/User/UserHeader';
import Footer from '../components/Main/Footer';
import axios from "axios";
import { useParams } from "react-router-dom";


const UserLayout = () => {
   const [isOpen,setIsOpen]=useState(false)
   const [User, setUser] = useState({})
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
   const _id = searchParams.get("user_id");
   console.log("userlayout",_id);
   
    const toggleDropdown = () => {
      setIsOpen(false);
    };
    useEffect(() => {
      if (!_id) return;
  
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/user/user`, {
            params: { _id }, // Pass _id in query parameters
            withCredentials: true, // Ensures cookies are sent if needed
          });
        
          setUser(response.data);
        } catch (err) {
          console.log(err)
        }
      };
  
      fetchUserDetails();
    }, [_id]);
    console.log(User);
    
  
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader isOpen={isOpen} setIsOpen={setIsOpen} profilepic={User.profilePic} />
      <main className="flex-grow mt-28 " onClick={toggleDropdown}>
        <Outlet _id={User._id} />
      </main> 
      <Footer />
    </div>
  );
};

export default UserLayout;

