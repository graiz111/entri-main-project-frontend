import React, { useState, useEffect, useContext } from "react";
import { FiEdit2, FiUser } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from "../../redux/Slices/userSlice";
import { ThemeContext } from "../../context/ThemeContext";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [signupData, setSignupData] = useState({});
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
      const response = await axios.post(`http://localhost:5001/api/${role}/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
  
      setSignupData(prevData => ({
        ...prevData,
        profilePicUrl: response.data.profilePicUrl,
      }));
  
      setMessage({ text: response.data.message, type: "success" });
      setEmail(signupDetails.email);
      setShowOtpSection(true);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`http://localhost:5001/api/${role}/otpverify`, {
        ...signupData,
        otp,
      },
      { withCredentials: true });
  
      setMessage({ text: response.data.message, type: "success" });
      // dispatch(addUser(response.data.data));
      // if(response.data.data.role=="user"){
      //   console.log("entered ",response.data.data.role);
        
      //   localStorage.setItem("user", JSON.stringify(response.data.data));
      // }
      if (response.data.success=="true") {
    
        console.log("entered ",response.data.data.role);
        
        // localStorage.setItem(`${role}`, JSON.stringify(response.data.data));
      
        if (response.data.data.role === "admin") setAdmin(response.data.data);
        if (response.data.data.role === "restaurant") setRestaurant(response.data.data);
        if (response.data.data.role === "delivery") setDelivery(response.data.data);
        if (response.data.data.role === "user") setUser(response.data.data);
  
      
  
      setTimeout(() => {
        navigate(`/${role}?${role}_id=${encodeURIComponent(response.data.data._id)}`);
      }, 1500);
    }
  }
  catch (error) {
   setMessage({
     text: error.response?.data?.message || "OTP verification failed in frontend.",
     type: "error",
   });
  }   
  }
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
              
              <button type="submit" className={`w-full px-6 py-3 text-white rounded-lg text-lg font-semibold
                ${theme === 'dark' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-green-500 hover:bg-green-600'
                } transform hover:scale-[1.02] transition-all duration-200 shadow-lg`}>
                Sign Up
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
              <button type="submit" className={`w-full px-6 py-3 text-white rounded-lg text-lg font-semibold
                ${theme === 'dark' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-green-500 hover:bg-green-600'
                } transform hover:scale-[1.02] transition-all duration-200 shadow-lg`}>
                Verify OTP
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
// import React, { useState,useEffect } from "react";
// import { FiEdit2 } from "react-icons/fi";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import { useSelector, useDispatch } from 'react-redux'
// import { addUser } from "../../redux/Slices/userSlice";

// const Signup = () => {
//   const [profilePic, setProfilePic] = useState(null);
//   const [showOtpSection, setShowOtpSection] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [signupData, setSignupData] = useState({});
//   const dispatch = useDispatch()
//   const user = useSelector((state) => state.useradd.value)

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
//    useEffect(() => {
//           window.scrollTo(0, 0);
//       }, []);

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
  
//     setSignupData(signupDetails); // Store initial signup data for OTP verification
  
//     Object.entries(signupDetails).forEach(([key, value]) => formData.append(key, value));
  
//     if (profilePic) {
//       formData.append("file", profilePic);
//     }
//      toast.success("wait for otp")
  
//     try {
//       // Make the API call to sign up
//       const response = await axios.post(`http://localhost:5001/api/${role}/signup`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });
  
//       // Update signupData state with the profilePicUrl from the response
//       setSignupData(prevData => ({
//         ...prevData,
//         profilePicUrl: response.data.profilePicUrl, // Add profilePicUrl to signupData
//       }));
  
//       // Show success message
//       setMessage({ text: response.data.message, type: "success" });
  
//       // Set email and show OTP section
//       setEmail(signupDetails.email);
//       setShowOtpSection(true);
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
//       const response = await axios.post(`http://localhost:5001/api/${role}/otpverify`, {
//         ...signupData, // This includes name, email, phone, password, role, and now profilePicUrl
//         otp,            // Include the OTP entered by the user
//       },
//       { withCredentials: true });
  
//       setMessage({ text: response.data.message, type: "success" });
//       console.log(response.data.data);

//       dispatch(addUser(response.data.data))
  
//       setTimeout(() => {
//         navigate(`/${role}?${role}_id=${encodeURIComponent(response.data.data._id)}`);

//       }, 1500);
//     } catch (error) {
//       setMessage({
//         text: error.response?.data?.message || "OTP verification failed in frontend.",
//         type: "error",
//       });
//     }
//   };
  

//   const backgroundColors = {
//     admin: "bg-yellow-200",
//     restaurant: "bg-orange-300",
//     user: "bg-green-300",
//     delivery: "bg-purple-300",
//   };

//   return (
//     <div className="flex-grow flex justify-center items-center">
//       <div className={`max-w-md mx-auto mt-10 p-6 ${backgroundColors[role]} shadow-xl rounded-2xl`}>
//         {!showOtpSection ? (
//           <>
//             <h2 className="text-2xl font-bold text-center mb-6">
//               {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Signup` : "Signup"}
//             </h2>

//             {message.text && (
//               <div
//                 className={`text-center p-2 mb-4 rounded-lg ${
//                   message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
//                 }`}
//               >
//                 {message.text}
//               </div>
//             )}

//             <form onSubmit={handleSignup} className="space-y-4">
//               <div className="flex flex-col items-center">
//                 <div className="relative w-32 h-32 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
//                   {profilePic ? (
//                     <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
//                   ) : (
//                     <span className="text-gray-500">No Image</span>
//                   )}
//                   <label htmlFor="profilePic" className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600">
//                     <FiEdit2 className="w-4 h-4" />
//                   </label>
//                   <input type="file" id="profilePic" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
//                 </div>
//               </div>
//               <input type="text" name="name" placeholder="Enter your name" className="w-full px-4 py-2 border rounded-lg" required />
//               <input type="email" name="email" placeholder="Enter your email" className="w-full px-4 py-2 border rounded-lg" required />
//               <input type="tel" name="phone" placeholder="Enter your phone" className="w-full px-4 py-2 border rounded-lg" required />
//               <input type="password" name="password" placeholder="Enter your password" className="w-full px-4 py-2 border rounded-lg" required />
              
//               <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
//                 Signup
//               </button>
//             </form>
//           </>
//         ) : (
//           <>
//             <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

//             {message.text && (
//               <div
//                 className={`text-center p-2 mb-4 rounded-lg ${
//                   message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
//                 }`}
//               >
//                 {message.text}
//               </div>
//             )}

//             <form onSubmit={handleOtpSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 maxLength="6"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className="w-full px-4 py-2 border rounded-lg text-center text-xl tracking-widest"
//                 placeholder="Enter 6-digit OTP"
//                 required
//               />
//               <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
//                 Verify OTP
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//       <ToastContainer/>
//     </div>
//   );
// };

// export default Signup;

// import React, { useState, useEffect, useContext } from "react";
// import { FiEdit2, FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useSelector, useDispatch } from 'react-redux';
// import { addUser } from "../../redux/Slices/userSlice";
// import { ToastContainer, toast } from 'react-toastify';
// import { ThemeContext } from "../../context/ThemeContext";

// const Signup = () => {
//   const [profilePic, setProfilePic] = useState(null);
//   const [showOtpSection, setShowOtpSection] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState({ text: "", type: "" });
//   const [signupData, setSignupData] = useState({});
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.useradd.value);
//   const { theme } = useContext(ThemeContext);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const searchParams = new URLSearchParams(location.search);
//   const role = searchParams.get("role");

//   // Rest of the existing functions remain unchanged...
//   // handleProfilePicChange, handleSignup, handleOtpSubmit, getRoleColor stay the same

//   return (
//     <div className={`flex items-center justify-center p-4 ${
//       theme === 'dark' ? 'bg-gray-900' : 'bg-white'
//     }`}>
//       <div className={`w-full max-w-md rounded-lg shadow-lg p-8 ${
//         theme === 'dark'
//           ? 'bg-gray-800 text-white'
//           : getRoleColor()
//       }`}>
//         {!showOtpSection ? (
//           <>
//             <div className="text-center mb-8">
//               <h2 className={`text-2xl font-bold ${
//                 theme === 'dark' ? 'text-white' : 'text-gray-900'
//               }`}>
//                 {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Signup` : "Signup"}
//               </h2>
//               <p className={`text-sm mt-2 ${
//                 theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
//               }`}>Create your account to get started</p>
//             </div>

//             {message.text && (
//               <div className={`p-4 mb-6 rounded-lg ${
//                 message.type === "success"
//                   ? theme === 'dark'
//                     ? "bg-green-900 text-green-100 border border-green-700"
//                     : "bg-green-50 text-green-700 border border-green-200"
//                   : theme === 'dark'
//                     ? "bg-red-900 text-red-100 border border-red-700"
//                     : "bg-red-50 text-red-700 border border-red-200"
//               }`}>
//                 <p className="text-sm">{message.text}</p>
//               </div>
//             )}

//             <form onSubmit={handleSignup} className="space-y-6">
//               <div className="flex flex-col items-center mb-6">
//                 <div className="relative w-32 h-32 rounded-full overflow-hidden group">
//                   <div className={`w-full h-full border-2 ${
//                     theme === 'dark'
//                       ? 'border-gray-600 bg-gray-700'
//                       : 'border-gray-300 bg-gray-50'
//                   } flex items-center justify-center`}>
//                     {profilePic ? (
//                       <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
//                     ) : (
//                       <FiUser className={`w-12 h-12 ${
//                         theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
//                       }`} />
//                     )}
//                   </div>
//                   <label htmlFor="profilePic" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
//                     <FiEdit2 className="w-6 h-6 text-white" />
//                   </label>
//                   <input type="file" id="profilePic" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
//                 </div>
//               </div><div className="space-y-4">
//                 {['name', 'email', 'phone', 'password'].map((field) => (
//                   <div key={field} className="relative">
//                     {field === 'name' && <FiUser className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />}
//                     {field === 'email' && <FiMail className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />}
//                     {field === 'phone' && <FiPhone className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />}
//                     {field === 'password' && <FiLock className={`absolute left-3 top-3 h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />}
//                     <input 
//                       type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
//                       name={field}
//                       placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)}`}
//                       className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-colors ${
//                         theme === 'dark'
//                           ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500'
//                           : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500'
//                       }`}
//                       required 
//                     />
//                   </div>
//                 ))}
//               </div>

//               <button 
//                 type="submit" 
//                 className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Create Account
//               </button>
//             </form>
//           </>
//         ) : (
//           <>
//             <div className="text-center mb-8">
//               <h2 className={`text-2xl font-bold ${
//                 theme === 'dark' ? 'text-white' : 'text-gray-900'
//               }`}>Verify Your Email</h2>
//               <p className={`text-sm mt-2 ${
//                 theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
//               }`}>Enter the OTP sent to your email</p>
//             </div>

//             {message.text && (
//               <div className={`p-4 mb-6 rounded-lg ${
//                 message.type === "success"
//                   ? theme === 'dark'
//                     ? "bg-green-900 text-green-100 border border-green-700"
//                     : "bg-green-50 text-green-700 border border-green-200"
//                   : theme === 'dark'
//                     ? "bg-red-900 text-red-100 border border-red-700"
//                     : "bg-red-50 text-red-700 border border-red-200"
//               }`}>
//                 <p className="text-sm">{message.text}</p>
//               </div>
//             )}

//             <form onSubmit={handleOtpSubmit} className="space-y-6">
//               <input
//                 type="text"
//                 maxLength="6"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 className={`w-full px-4 py-3 border rounded-lg text-center text-xl tracking-widest outline-none transition-colors ${
//                   theme === 'dark'
//                     ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500'
//                     : 'bg-white border-gray-300 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500'
//                 }`}
//                 placeholder="Enter 6-digit OTP"
//                 required
//               />
//               <button 
//                 type="submit" 
//                 className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
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
 
