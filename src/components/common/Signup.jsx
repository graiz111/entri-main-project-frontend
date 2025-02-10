// import React, { useState } from "react";
// import { FiEdit2 } from "react-icons/fi";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setSignupData, setOtpVerified, setRole } from "../../redux/Actions/UserActions";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Signup = () => {
//   const [profilePic, setProfilePic] = useState(null);
//   const [SignupData, setSignupData] = useState({})
//   const [showOtpSection, setShowOtpSection] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [email, setEmail] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const role = searchParams.get("role");

//   dispatch(setRole(role));

//   const handleProfilePicChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePic(file);
//     }
//   };

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
//   console.log(signupDetails);
  
//     setSignupData(signupDetails);
//     dispatch(setSignupData(signupDetails));
  
//     Object.entries(signupDetails).forEach(([key, value]) => formData.append(key, value));
  
//     if (profilePic) {
//       formData.append("file", profilePic);
//     }
  
//     try {
//       const response = await axios.post(`http://localhost:5001/api/${role}/signup`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });
  
//       toast.success(response.data.message);
//       setSignupData(prevData => ({
//         ...prevData,
//         profilePicUrl: response.data.profilePicUrl,
//       }));
//       setEmail(signupDetails.email);
//       setShowOtpSection(true);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "An error occurred. Please try again.");
//     }
//   };
  

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(`http://localhost:5001/api/${role}/otpverify`, {
//         ...SignupData, 
//         otp, 

//       }, { withCredentials: true });

//       dispatch(setOtpVerified(true));

//       toast.success(response.data.message);

//       setTimeout(() => {
//         navigate(`/${role}?${role}_id=${encodeURIComponent(response.data.data._id)}`);
//       }, 1500);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "OTP verification failed.");
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

//             <form onSubmit={handleSignup} className="space-y-4">
//               <div className="flex flex-col items-center">
//                 <div className="relative w-32 h-32 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
//                   {profilePic ? (
//                     <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
//                   ) : (
//                     <span className="text-gray-500">No Image</span>
//                   )}
//                   <label htmlFor="profilePic" className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
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
//               <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
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


import React, { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux'
import { addUser } from "../../redux/Slices/userSlice";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [signupData, setSignupData] = useState({});
  const dispatch = useDispatch()
  const user = useSelector((state) => state.useradd.value)

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
  
    setSignupData(signupDetails); // Store initial signup data for OTP verification
  
    Object.entries(signupDetails).forEach(([key, value]) => formData.append(key, value));
  
    if (profilePic) {
      formData.append("file", profilePic);
    }
     toast.success("wait for otp")
  
    try {
      // Make the API call to sign up
      const response = await axios.post(`http://localhost:5001/api/${role}/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
  
      // Update signupData state with the profilePicUrl from the response
      setSignupData(prevData => ({
        ...prevData,
        profilePicUrl: response.data.profilePicUrl, // Add profilePicUrl to signupData
      }));
  
      // Show success message
      setMessage({ text: response.data.message, type: "success" });
  
      // Set email and show OTP section
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
        ...signupData, // This includes name, email, phone, password, role, and now profilePicUrl
        otp,            // Include the OTP entered by the user
      },
      { withCredentials: true });
  
      setMessage({ text: response.data.message, type: "success" });
      console.log(response.data.data);

      dispatch(addUser(response.data.data))
  
      setTimeout(() => {
        navigate(`/${role}?${role}_id=${encodeURIComponent(user._id)}`);

      }, 1500);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "OTP verification failed in frontend.",
        type: "error",
      });
    }
  };
  

  const backgroundColors = {
    admin: "bg-yellow-200",
    restaurant: "bg-orange-300",
    user: "bg-green-300",
    delivery: "bg-purple-300",
  };

  return (
    <div className="flex-grow flex justify-center items-center">
      <div className={`max-w-md mx-auto mt-10 p-6 ${backgroundColors[role]} shadow-xl rounded-2xl`}>
        {!showOtpSection ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">
              {role ? `${role.charAt(0).toUpperCase() + role.slice(1)} Signup` : "Signup"}
            </h2>

            {message.text && (
              <div
                className={`text-center p-2 mb-4 rounded-lg ${
                  message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profilePic ? (
                    <img src={URL.createObjectURL(profilePic)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                  <label htmlFor="profilePic" className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                    <FiEdit2 className="w-4 h-4" />
                  </label>
                  <input type="file" id="profilePic" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
                </div>
              </div>
              <input type="text" name="name" placeholder="Enter your name" className="w-full px-4 py-2 border rounded-lg" required />
              <input type="email" name="email" placeholder="Enter your email" className="w-full px-4 py-2 border rounded-lg" required />
              <input type="tel" name="phone" placeholder="Enter your phone" className="w-full px-4 py-2 border rounded-lg" required />
              <input type="password" name="password" placeholder="Enter your password" className="w-full px-4 py-2 border rounded-lg" required />
              
              <button type="submit" className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Signup
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

            {message.text && (
              <div
                className={`text-center p-2 mb-4 rounded-lg ${
                  message.type === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-center text-xl tracking-widest"
                placeholder="Enter 6-digit OTP"
                required
              />
              <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
