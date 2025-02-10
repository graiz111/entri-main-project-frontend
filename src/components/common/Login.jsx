import React, { useState } from 'react';
import { useLocation,useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { addUser } from "../../redux/Slices/userSlice";
import { ToastContainer, toast } from 'react-toastify';

const UserLogin = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role") 

  const [showOtp, setShowOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 
  const [userDetails, setUserDetails] = useState(null); 
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user = useSelector((state) => state.useradd.value)

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    toast.success("wait for otp")
    try {
      const response = await axios.post(`http://localhost:5001/api/${role}/login`, {
        email,
        password,
      },
      { withCredentials: true });
  
      setUserDetails({ email, _id: response.data._id ,role});
  
      if (response.data.message) {
        setErrorMessage(response.data.message);
      } else {
        setErrorMessage("");
      }
  
      setShowOtp(true);
    } catch (error) {
      // Properly extract error messages from backend
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;
  
    console.log(userDetails,otp,role);
    
  
    try {
      const response = await axios.post(
        `http://localhost:5001/api/${role}/otploginverify`,
        {
          email: userDetails.email,
          otp,
          role,
          _id:userDetails._id
          
        },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        
        
        setErrorMessage(response.data.message || "Something went wrong");
      }
      
      
      console.log("OTP verified successfully:", response.data);
  
      if (response.data?.data?._id) {
        console.log(response.data?.data?._id);
        dispatch(addUser(response.data.data))
        console.log("reduxuser",user)
        
        
        setTimeout(() => {
          navigate(`/${role}?${role}_id=${encodeURIComponent(response.data?.data?._id)}`);
        }, 1500);
      } else {
        setErrorMessage("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "OTP verification failed.");
    }
  };
  


  const backgroundColors = {
    admin: "bg-yellow-200",
    restaurant: "bg-orange-200",
    user: "bg-green-200",
    delivery: "bg-purple-300"
  };

  return (
    <div className='overflow-scroll '>
      <div className={`${backgroundColors[role]} max-w-md mx-auto mt-10 p-6 shadow-xl rounded-2xl`}>
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {errorMessage && (
          <div className="bg-red-200 text-red-800 p-2 rounded-lg mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
          <a className='text-blue-600 cursor-pointer hover:underline'>forgot password</a>
        </form>

        {/* OTP Form */}
        {showOtp && (
          <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the OTP"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Submit OTP
            </button>
          </form>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
}

export default UserLogin;
