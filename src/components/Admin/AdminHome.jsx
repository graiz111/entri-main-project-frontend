import React,{useState,useEffect} from 'react'
import { NavLink,useLocation } from "react-router-dom";
import axios from 'axios'

const AdminHome = () => {
  const [User, setUser] = useState({})
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const _id = searchParams.get("user_id");
  console.log("residin home ",_id);

  useEffect(() => {
      if (!_id) return;
  
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/api/admin/users`, {
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
    console.log('admin',User);
    // const Profilepic=User.profilePic
          
  return (
    <>
    <div className='flex flex-col '>
      <div className='flex-grow py-10 overflow-scroll' >
              <div className='bg-gray-500 container m-auto mx-auto items-center  flex justify-around flex-col md:flex-row sm:flex-row' >
                  
                     
      
                  
              </div>
             
      
          </div>
      
  
    </div>
    </>
  )
}

export default AdminHome