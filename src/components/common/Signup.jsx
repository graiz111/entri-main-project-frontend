import React, { useState, useEffect, useContext } from "react";
import { FiEdit2, FiUser } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from "../../redux/Slices/userSlice";
import { ThemeContext } from "../../context/ThemeContext";
import { axiosInstance } from "../../utils/axios";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [signupData, setSignupData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { theme } = useContext(ThemeContext);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role");

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData();
    const signupDetails = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      password: e.target.password.value,
      role: role,
    };
  
    setSignupData(signupDetails);
    Object.entries(signupDetails).forEach(([key, value]) => formData.append(key, value));
  
    if (profilePic) {
      formData.append("file", profilePic);
    }
    
    try {
      const response = await axiosInstance.post(`/${role}/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if(response.data.success===true){
        setSignupData(prevData => ({
          ...prevData,
          profilePicUrl: response.data.profilePicUrl,
        }));
    
        setMessage({ text: response.data.message, type: "success" });
        setEmail(signupDetails.email);
        setShowOtpSection(true);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await axiosInstance.post(`/${role}/otpverify`, {
        ...signupData,
        otp,
      });
  
      if (response.data.success===true) {
        setMessage({ text: response.data.message, type: "success" });
        const userData = response.data.data;
    
        ("entered ",response.data.data.role);
        
        setTimeout(() => {
          navigate(userData.role === "user" ? `/${userData.role}/${userData._id}/${userData.role}` : `/${userData.role}/user/${userData._id}/${userData.role}`);
        }, 1500);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "OTP verification failed in frontend.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getBackgroundColor = () => {
    if (theme === 'dark') {
      return {
        admin: "bg-yellow-900",
        restaurant: "bg-orange-900",
        user: "bg-green-900",
        delivery: "bg-purple-900",
      }[role];
    }
    return {
      admin: "bg-yellow-200",
      restaurant: "bg-orange-300",
      user: "bg-green-300",
      delivery: "bg-purple-300",
    }[role];
  };

  return (
    <div className={`flex-grow flex justify-center items-center p-10 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className={`max-w-md w-full mx-auto mt-10 p-8 ${getBackgroundColor()} 
        shadow-2xl rounded-2xl transform hover:scale-[1.02] transition-transform duration-300
        ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {!showOtpSection ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-8 relative">
              <span className="relative inline-block">
                {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Signup` : "Signup"}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-current opacity-20"></div>
              </span>
            </h2>

            {message.text && (
              <div className={`text-center p-3 mb-6 rounded-lg backdrop-blur-sm ${
                message.type === "success" 
                  ? 'bg-green-500/20 text-green-200' 
                  : 'bg-red-500/20 text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-36 h-36 rounded-full border-4 border-opacity-20 bg-gradient-to-br from-white/10 to-black/10 flex items-center justify-center overflow-hidden shadow-xl">
                  {profilePic ? (
                    <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="w-16 h-16 opacity-30" />
                  )}
                  <label htmlFor="profilePic" className="absolute bottom-3 right-3 bg-green-500 text-white p-3 rounded-full cursor-pointer hover:bg-green-600 transform hover:scale-110 transition-transform duration-200 shadow-lg">
                    <FiEdit2 className="w-5 h-5" />
                  </label>
                  <input type="file" id="profilePic" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
                </div>
              </div>

              <div className="space-y-4">
                {['name', 'email', 'phone', 'password'].map((field) => (
                  <input
                    key={field}
                    type={field === 'password' ? 'password' : 'text'}
                    name={field}
                    placeholder={`Enter your ${field}`}
                    className={`w-full px-5 py-3 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none
                      ${theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 focus:ring-green-500 text-white' 
                        : 'bg-white border-gray-200 focus:ring-green-400'
                      } border transition-all duration-200`}
                    required
                  />
                ))}
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full px-6 py-3 text-white rounded-lg text-lg font-semibold
                  ${theme === 'dark' 
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-800' 
                    : 'bg-green-500 hover:bg-green-600 disabled:bg-green-400'
                  } transform hover:scale-[1.02] transition-all duration-200 shadow-lg 
                  disabled:cursor-wait disabled:transform-none`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Please wait for OTP...</span>
                  </div>
                ) : "Sign Up"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-8">Verify OTP</h2>

            {message.text && (
              <div className={`text-center p-3 mb-6 rounded-lg backdrop-blur-sm ${
                message.type === "success" 
                  ? 'bg-green-500/20 text-green-200' 
                  : 'bg-red-500/20 text-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full px-6 py-4 text-center text-2xl tracking-[0.5em] rounded-lg 
                  ${theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 focus:ring-green-500 text-white' 
                    : 'bg-white border-gray-200 focus:ring-green-400'
                  } border focus:ring-2 focus:ring-opacity-50 outline-none transition-all duration-200`}
                placeholder="• • • • • •"
                required
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full px-6 py-3 text-white rounded-lg text-lg font-semibold
                  ${theme === 'dark' 
                    ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-800' 
                    : 'bg-green-500 hover:bg-green-600 disabled:bg-green-400'
                  } transform hover:scale-[1.02] transition-all duration-200 shadow-lg
                  disabled:cursor-wait disabled:transform-none`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </div>
                ) : "Verify OTP"}
              </button>
            </form>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
// import React, { useState, useEffect, useContext } from "react";
// import { FiEdit2, FiUser } from "react-icons/fi";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import { useSelector, useDispatch } from 'react-redux';
// import { addUser } from "../../redux/Slices/userSlice";
// import { ThemeContext } from "../../context/ThemeContext";
// import { axiosInstance } from "../../utils/axios";

// const Signup = () => {
//   const [profilePic, setProfilePic] = useState(null);
//   const [showOtpSection, setShowOtpSection] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [signupData, setSignupData] = useState({});
//   const dispatch = useDispatch();
//   const { theme } = useContext(ThemeContext);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const searchParams = new URLSearchParams(location.search);
//   const role = searchParams.get("role");

//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePic(file);
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     const signupDetails = {
//       name: e.target.name.value,
//       email: e.target.email.value,
//       phone: e.target.phone.value,
//       password: e.target.password.value,
//       role: role,
//     };
  
//     setSignupData(signupDetails);
//     Object.entries(signupDetails).forEach(([key, value]) => formData.append(key, value));
  
//     if (profilePic) {
//       formData.append("file", profilePic);
//     }
    
  
//     try {
//       const response = await axiosInstance.post(`/${role}/signup`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
        
//       });
//       if(response.data.success===true){
//         setSignupData(prevData => ({
//           ...prevData,
//           profilePicUrl: response.data.profilePicUrl,
//         }));
    
//         setMessage({ text: response.data.message, type: "success" });
//         setEmail(signupDetails.email);
//         setShowOtpSection(true);
//       }
  
      
//     } catch (error) {
//       setMessage({
//         text: error.response?.data?.message || "An error occurred. Please try again.",
//         type: "error",
//       });
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
  
//     try {
//       const response = await axiosInstance.post(`/${role}/otpverify`, {
//         ...signupData,
//         otp,
//       });
  
      
//       if (response.data.success===true) {
//         setMessage({ text: response.data.message, type: "success" });
//         const userData = response.data.data;
    
//         ("entered ",response.data.data.role);
        
//       setTimeout(() => {
//         navigate(userData.role === "user" ? `/${userData.role}/${userData._id}/${userData.role}` : `/${userData.role}/user/${userData._id}/${userData.role}`);
       
//       }, 1500);
//     }
//   }
//   catch (error) {
//    setMessage({
//      text: error.response?.data?.message || "OTP verification failed in frontend.",
//      type: "error",
//    });
//   }   
//   }
//   const getBackgroundColor = () => {
//     if (theme === 'dark') {
//       return {
//         admin: "bg-yellow-900",
//         restaurant: "bg-orange-900",
//         user: "bg-green-900",
//         delivery: "bg-purple-900",
//       }[role];
//     }
//     return {
//       admin: "bg-yellow-200",
//       restaurant: "bg-orange-300",
//       user: "bg-green-300",
//       delivery: "bg-purple-300",
//     }[role];
//   };

//   return (
//     <div className={`flex-grow flex justify-center items-center p-10 ${
//       theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
//     }`}>
//       <div className={`max-w-md w-full mx-auto mt-10 p-8 ${getBackgroundColor()} 
//         shadow-2xl rounded-2xl transform hover:scale-[1.02] transition-transform duration-300
//         ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
//         {!showOtpSection ? (
//           <>
//             <h2 className="text-3xl font-bold text-center mb-8 relative">
//               <span className="relative inline-block">
//                 {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Signup` : "Signup"}
//                 <div className="absolute bottom-0 left-0 w-full h-1 bg-current opacity-20"></div>
//               </span>
//             </h2>

//             {message.text && (
//               <div className={`text-center p-3 mb-6 rounded-lg backdrop-blur-sm ${
//                 message.type === "success" 
//                   ? 'bg-green-500/20 text-green-200' 
//                   : 'bg-red-500/20 text-red-200'
//               }`}>
//                 {message.text}
//               </div>
//             )}

//             <form onSubmit={handleSignup} className="space-y-6">
//               <div className="flex flex-col items-center mb-8">
//                 <div className="relative w-36 h-36 rounded-full border-4 border-opacity-20 bg-gradient-to-br from-white/10 to-black/10 flex items-center justify-center overflow-hidden shadow-xl">
//                   {profilePic ? (
//                     <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
//                   ) : (
//                     <FiUser className="w-16 h-16 opacity-30" />
//                   )}
//                   <label htmlFor="profilePic" className="absolute bottom-3 right-3 bg-green-500 text-white p-3 rounded-full cursor-pointer hover:bg-green-600 transform hover:scale-110 transition-transform duration-200 shadow-lg">
//                     <FiEdit2 className="w-5 h-5" />
//                   </label>
//                   <input type="file" id="profilePic" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {['name', 'email', 'phone', 'password'].map((field) => (
//                   <input
//                     key={field}
//                     type={field === 'password' ? 'password' : 'text'}
//                     name={field}
//                     placeholder={`Enter your ${field}`}
//                     className={`w-full px-5 py-3 rounded-lg focus:ring-2 focus:ring-opacity-50 outline-none
//                       ${theme === 'dark' 
//                         ? 'bg-gray-800 border-gray-700 focus:ring-green-500 text-white' 
//                         : 'bg-white border-gray-200 focus:ring-green-400'
//                       } border transition-all duration-200`}
//                     required
//                   />
//                 ))}
//               </div>
              
//               <button type="submit" className={`w-full px-6 py-3 text-white rounded-lg text-lg font-semibold
//                 ${theme === 'dark' 
//                   ? 'bg-green-600 hover:bg-green-700' 
//                   : 'bg-green-500 hover:bg-green-600'
//                 } transform hover:scale-[1.02] transition-all duration-200 shadow-lg`}>
//                 Sign Up
//               </button>
//             </form>
//           </>
//         ) : (
//           <>
//             <h2 className="text-3xl font-bold text-center mb-8">Verify OTP</h2>

//             {message.text && (
//               <div className={`text-center p-3 mb-6 rounded-lg backdrop-blur-sm ${
//                 message.type === "success" 
//                   ? 'bg-green-500/20 text-green-200' 
//                   : 'bg-red-500/20 text-red-200'
//               }`}>
//                 {message.text}
//               </div>
//             )}

//             <form onSubmit={handleOtpSubmit} className="space-y-6">
//               <input
//                 type="text"
//                 maxLength="6"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className={`w-full px-6 py-4 text-center text-2xl tracking-[0.5em] rounded-lg 
//                   ${theme === 'dark' 
//                     ? 'bg-gray-800 border-gray-700 focus:ring-green-500 text-white' 
//                     : 'bg-white border-gray-200 focus:ring-green-400'
//                   } border focus:ring-2 focus:ring-opacity-50 outline-none transition-all duration-200`}
//                 placeholder="• • • • • •"
//                 required
//               />
//               <button type="submit" className={`w-full px-6 py-3 text-white rounded-lg text-lg font-semibold
//                 ${theme === 'dark' 
//                   ? 'bg-green-600 hover:bg-green-700' 
//                   : 'bg-green-500 hover:bg-green-600'
//                 } transform hover:scale-[1.02] transition-all duration-200 shadow-lg`}>
//                 Verify OTP
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Signup;
