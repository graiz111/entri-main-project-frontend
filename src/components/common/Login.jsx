import React, { useState, useEffect, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Mail, Lock, ArrowRight, UserCircle2, Loader, ArrowLeft } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

import { axiosInstance } from "../../utils/axios";

const UserLogin = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role");
  const { theme } = useContext(ThemeContext);

  const [showOtp, setShowOtp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgetFlow, setIsForgetFlow] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axiosInstance.post(
        `/${role}/login`,
        { email, password },
        { withCredentials: true }
      );

      setUserDetails({ email, _id: response.data._id, role });
      setIsForgetFlow(false);

      if (response.data.message) {
        setErrorMessage(response.data.message);
      } else {
        setErrorMessage("");
      }
      setShowOtp(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const otp = e.target.otp.value;

    try {
      const response = await axiosInstance.post(
        `/${role}/otploginverify`,
        {
          email: userDetails.email,
          otp,
          role,
          _id: userDetails._id,
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        const userData = response.data.data;
        navigate(userData.role === "user" ? `/${userData.role}/${userData._id}/${userData.role}` : `/${userData.role}/user/${userData._id}/${userData.role}`);
      } else {
        setErrorMessage(response.data.message || "Something went wrong");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const response = await axiosInstance.post(
        `/${role}/forgot-password`,
        { email: forgotEmail },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setSuccessMessage("OTP sent to your email");
        setUserDetails({ email: forgotEmail, role });
        setIsForgetFlow(true);
        setShowForgotPassword(false);
        setShowOtp(true);
      } else {
        setErrorMessage(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to process your request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    const otp = e.target.otp.value;

    try {
      const response = await axiosInstance.post(
        `/${role}/verify-forgot-password-otp`,
        {
          email: userDetails.email,
          otp,
          role,
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setSuccessMessage("OTP verified successfully");
        setShowOtp(false);
        setShowResetPassword(true);
      } else {
        setErrorMessage(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/${role}/reset-password`,
        {
          email: userDetails.email,
          password: newPassword,
          role,
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setSuccessMessage("Password reset successfully");
        toast.success("Password has been reset successfully");
        
        // Reset all states
        setNewPassword("");
        setConfirmPassword("");
        setForgotEmail("");
        setUserDetails(null);
        setIsForgetFlow(false);
        
        // Redirect to login page after short delay
        setTimeout(() => {
          setShowResetPassword(false);
          navigate(`/login?role=${role}`);
        }, 2000);
      } else {
        setErrorMessage(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = () => {
    if (theme === "dark") {
      return {
        admin: "bg-amber-900/30",
        restaurant: "bg-orange-900/30",
        user: "bg-emerald-900/30",
        delivery: "bg-purple-900/30",
      }[role] || "bg-gray-800";
    }
    return {
      admin: "bg-amber-50",
      restaurant: "bg-orange-50",
      user: "bg-emerald-50",
      delivery: "bg-purple-50",
    }[role] || "bg-gray-50";
  };

  return (
    <div className={`flex items-center justify-center p-20 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className={`w-full max-w-md ${getRoleColor()} rounded-2xl shadow-xl p-8 
        backdrop-blur-sm backdrop-filter transform hover:scale-[1.01] transition-all duration-300 
        ${theme === 'dark' ? 'shadow-gray-900/50' : 'shadow-gray-200/50'}`}>
        
        <div className="space-y-3 text-center mb-8">
          <div className="flex justify-center mb-6">
            <UserCircle2 className={`w-16 h-16 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`} />
          </div>
          <h2 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {showForgotPassword 
              ? "Forgot Password" 
              : showResetPassword 
                ? "Reset Password" 
                : showOtp 
                  ? "OTP Verification" 
                  : "Welcome Back"}
          </h2>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {showForgotPassword 
              ? "Enter your email to receive an OTP" 
              : showResetPassword 
                ? "Create a new password" 
                : showOtp 
                  ? "Enter the OTP sent to your email" 
                  : "Please enter your credentials to continue"}
          </p>
        </div>

        {errorMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            theme === 'dark' 
              ? 'bg-red-900/20 border-red-800' 
              : 'bg-red-50 border-red-200'
          } border`}>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-red-300' : 'text-red-600'
            }`}>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            theme === 'dark' 
              ? 'bg-green-900/20 border-green-800' 
              : 'bg-green-50 border-green-200'
          } border`}>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-green-300' : 'text-green-600'
            }`}>{successMessage}</p>
          </div>
        )}

        {!showOtp && !showForgotPassword && !showResetPassword && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Mail className={`absolute left-3 top-3 h-5 w-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200
                    ${theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' 
                      : 'bg-white border-gray-300 focus:border-green-500'
                    } border focus:ring-2 focus:ring-green-500/20`}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <Lock className={`absolute left-3 top-3 h-5 w-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200
                    ${theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' 
                      : 'bg-white border-gray-300 focus:border-green-500'
                    } border focus:ring-2 focus:ring-green-500/20`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(true);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`text-sm hover:underline transition-colors ${
                  theme === 'dark' 
                    ? 'text-green-400 hover:text-green-300' 
                    : 'text-green-600 hover:text-green-800'
                }`}
                disabled={isLoading}
              >
                Forgot password?
              </button>
              <NavLink to={`/signup?role=${role}`}>
                <button
                  type="button"
                  className={`text-sm hover:underline transition-colors ${
                    theme === 'dark' 
                      ? 'text-green-400 hover:text-green-300' 
                      : 'text-green-600 hover:text-green-800'
                  }`}
                  disabled={isLoading}
                >
                  Not registered? Sign Up
                </button>
              </NavLink>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                transform transition-all duration-200 
                ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:translate-y-[-1px]'}
                ${theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {showForgotPassword && (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="relative">
              <Mail className={`absolute left-3 top-3 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Email address"
                className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200
                  ${theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' 
                    : 'bg-white border-gray-300 focus:border-green-500'
                  } border focus:ring-2 focus:ring-green-500/20`}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                  transform transition-all duration-200 
                  ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:translate-y-[-1px]'}
                  ${theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                  ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </button>
            </div>
          </form>
        )}

        {showOtp && (
          <form 
            onSubmit={isForgetFlow ? handleForgotPasswordOtpSubmit : handleOtpSubmit} 
            className="mt-8 space-y-6"
          >
            <div>
              <label 
                htmlFor="otp" 
                className={`block text-sm font-medium mb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Enter the OTP sent to your email
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter OTP"
                className={`w-full px-4 py-3 text-center text-lg tracking-[0.3em] rounded-lg 
                  outline-none transition-all duration-200
                  ${theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' 
                    : 'bg-white border-gray-300 focus:border-green-500'
                  } border focus:ring-2 focus:ring-green-500/20`}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg 
                  transform transition-all duration-200
                  ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:translate-y-[-1px]'}
                  ${theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (isForgetFlow) {
                    setShowOtp(false);
                    setShowForgotPassword(true);
                  } else {
                    setShowOtp(false);
                  }
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg
                  ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            </div>
          </form>
        )}

        {showResetPassword && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Lock className={`absolute left-3 top-3 h-5 w-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200
                    ${theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' 
                      : 'bg-white border-gray-300 focus:border-green-500'
                    } border focus:ring-2 focus:ring-green-500/20`}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="relative">
                <Lock className={`absolute left-3 top-3 h-5 w-5 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200
                    ${theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' 
                      : 'bg-white border-gray-300 focus:border-green-500'
                    } border focus:ring-2 focus:ring-green-500/20`}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                transform transition-all duration-200 
                ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:translate-y-[-1px]'}
                ${theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>
        )}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default UserLogin;
// import React, { useState, useEffect, useContext } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { Mail, Lock, ArrowRight, UserCircle2, Loader } from "lucide-react";
// import { ThemeContext } from "../../context/ThemeContext";
// import { RestaurantAuthContext } from "../../context/RestaurantAuthContext"; // Import context
// import { AdminAuthContext} from "../../context/AdminAuthContext"; // Import context
// import { UserAuthContext } from "../../context/UserAuthContext"; // Import context
// import { DeliveryAuthContext } from "../../context/DeliveryAuthContext"; // Import context

// const UserLogin = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const role = searchParams.get("role");
//   const { theme } = useContext(ThemeContext);

//   const [showOtp, setShowOtp] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [userDetails, setUserDetails] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     try {
//       const response = await axios.post(
//         `http://localhost:5001/api/${role}/login`,
//         { email, password },
//         { withCredentials: true }
//       );

//       setUserDetails({ email, _id: response.data._id, role });

//       if (response.data.message) {
//         setErrorMessage(response.data.message);
//       } else {
//         setErrorMessage("");
//       }
//       setShowOtp(true);
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOtpSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     const otp = e.target.otp.value;

//     try {
//       const response = await axios.post(
//         `http://localhost:5001/api/${role}/otploginverify`,
//         {
//           email: userDetails.email,
//           otp,
//           role,
//           _id: userDetails._id,
//         },
//         { withCredentials: true }
//       );
      
//       if (response.data.success) {
//         const userData = response.data.data;
//         navigate(userData.role === "user" ? `/${userData.role}/${userData._id}/${userData.role}` : `/${userData.role}/user/${userData._id}/${userData.role}`);
//       } else {
//         setErrorMessage(response.data.message || "Something went wrong");
//       }
//     } catch (error) {
//       setErrorMessage(error.response?.data?.message || "OTP verification failed.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const getRoleColor = () => {
//     if (theme === "dark") {
//       return {
//         admin: "bg-amber-900/30",
//         restaurant: "bg-orange-900/30",
//         user: "bg-emerald-900/30",
//         delivery: "bg-purple-900/30",
//       }[role] || "bg-gray-800";
//     }
//     return {
//       admin: "bg-amber-50",
//       restaurant: "bg-orange-50",
//       user: "bg-emerald-50",
//       delivery: "bg-purple-50",
//     }[role] || "bg-gray-50";
//   };

//   return (
//     <div className={`flex items-center justify-center p-20 ${
//       theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
//     }`}>
//       <div className={`w-full max-w-md ${getRoleColor()} rounded-2xl shadow-xl p-8 
//         backdrop-blur-sm backdrop-filter transform hover:scale-[1.01] transition-all duration-300 
//         ${theme === 'dark' ? 'shadow-gray-900/50' : 'shadow-gray-200/50'}`}>
        
//         <div className="space-y-3 text-center mb-8">
//           <div className="flex justify-center mb-6">
//             <UserCircle2 className={`w-16 h-16 ${
//               theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//             }`} />
//           </div>
//           <h2 className={`text-3xl font-bold ${
//             theme === 'dark' ? 'text-white' : 'text-gray-800'
//           }`}>
//             Welcome Back
//           </h2>
//           <p className={`text-sm ${
//             theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//           }`}>
//             Please enter your credentials to continue
//           </p>
//         </div>

//         {errorMessage && (
//           <div className={`mb-6 p-4 rounded-lg ${
//             theme === 'dark' 
//               ? 'bg-red-900/20 border-red-800' 
//               : 'bg-red-50 border-red-200'
//           } border`}>
//             <p className={`text-sm ${
//               theme === 'dark' ? 'text-red-300' : 'text-red-600'
//             }`}>{errorMessage}</p>
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div className="space-y-4">
//             <div className="relative">
//               <Mail className={`absolute left-3 top-3 h-5 w-5 ${
//                 theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//               }`} />
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 placeholder="Email address"
//                 className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200
//                   ${theme === 'dark' 
//                     ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' 
//                     : 'bg-white border-gray-300 focus:border-green-500'
//                   } border focus:ring-2 focus:ring-green-500/20`}
//                 required
//                 disabled={isLoading || showOtp}
//               />
//             </div>

//             <div className="relative">
//               <Lock className={`absolute left-3 top-3 h-5 w-5 ${
//                 theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//               }`} />
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 placeholder="Password"
//                 className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200
//                   ${theme === 'dark' 
//                     ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' 
//                     : 'bg-white border-gray-300 focus:border-green-500'
//                   } border focus:ring-2 focus:ring-green-500/20`}
//                 required
//                 disabled={isLoading || showOtp}
//               />
//             </div>
//           </div>

//           {!showOtp && (
//             <div className="flex items-center justify-between">
//               <button
//                 type="button"
//                 className={`text-sm hover:underline transition-colors ${
//                   theme === 'dark' 
//                     ? 'text-green-400 hover:text-green-300' 
//                     : 'text-green-600 hover:text-green-800'
//                 }`}
//                 disabled={isLoading}
//               >
//                 Forgot password?
//               </button>
//               <NavLink to={`/signup?role=${role}`}>
//                 <button
//                   type="button"
//                   className={`text-sm hover:underline transition-colors ${
//                     theme === 'dark' 
//                       ? 'text-green-400 hover:text-green-300' 
//                       : 'text-green-600 hover:text-green-800'
//                   }`}
//                   disabled={isLoading}
//                 >
//                   Not registered? Sign Up
//                 </button>
//               </NavLink>
//             </div>
//           )}

//           {!showOtp && (
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
//                 transform transition-all duration-200 
//                 ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:translate-y-[-1px]'}
//                 ${theme === 'dark'
//                   ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30'
//                   : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
//                 }`}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader className="h-4 w-4 animate-spin" />
//                   <span>Please wait for OTP...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Continue</span>
//                   <ArrowRight className="h-4 w-4" />
//                 </>
//               )}
//             </button>
//           )}
//         </form>

//         {showOtp && (
//           <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
//             <div>
//               <label 
//                 htmlFor="otp" 
//                 className={`block text-sm font-medium mb-2 ${
//                   theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                 }`}
//               >
//                 Enter the OTP sent to your email
//               </label>
//               <input
//                 type="text"
//                 id="otp"
//                 name="otp"
//                 placeholder="Enter OTP"
//                 className={`w-full px-4 py-3 text-center text-lg tracking-[0.3em] rounded-lg 
//                   outline-none transition-all duration-200
//                   ${theme === 'dark' 
//                     ? 'bg-gray-800 border-gray-700 focus:border-green-500 text-white' 
//                     : 'bg-white border-gray-300 focus:border-green-500'
//                   } border focus:ring-2 focus:ring-green-500/20`}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg 
//                 transform transition-all duration-200
//                 ${isLoading ? 'cursor-not-allowed opacity-70' : 'hover:translate-y-[-1px]'}
//                 ${theme === 'dark'
//                   ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/30'
//                   : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
//                 }`}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader className="h-4 w-4 animate-spin" />
//                   <span>Verifying...</span>
//                 </>
//               ) : (
//                 <span>Verify OTP</span>
//               )}
//             </button>
//           </form>
//         )}
//       </div>
//       <ToastContainer/>
//     </div>
//   );
// };

// export default UserLogin;
