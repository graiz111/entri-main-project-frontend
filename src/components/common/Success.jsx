import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../utils/axios"; 
import { toast, ToastContainer } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import { FaCheckCircle, FaHome, FaHistory } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Success = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(6); 
  const [status, setStatus] = useState('processing');
  const { theme } = useContext(ThemeContext);

  
  useEffect(() => {
    const handleSuccess = async () => {
   
      
      try {
      
        const response = await axiosInstance.get(`/payment/session-status?session_id=${sessionId}`);
        if (response.data.success) {
       
          await axiosInstance.delete(`/cart/clearcart/${userId}`);
          setStatus('completed');
  
        } else {
          setStatus('failed');
          toast.error("Payment verification failed.");
        }
      } catch (error) {
        console.error("Error verifying payment or clearing cart:", error);
        setStatus('failed');
        toast.error("An error occurred. Please try again.");
      }
    };
    
    if (sessionId) {
      handleSuccess();
    } else {
      setStatus('completed');
    }
    
  
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          navigate(`/user/${userId}/user`);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    
  
    return () => clearInterval(timer);
  }, [navigate, userId, sessionId]);

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500 text-6xl mb-4" />;
      case 'failed':
        return <div className="text-red-500 text-6xl mb-4">✕</div>;
      default:
        return (
          <div className="animate-pulse">
            <div className="h-16 w-16 rounded-full border-4 border-t-purple-500 border-purple-200 animate-spin mx-auto mb-4"></div>
          </div>
        );
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'completed':
        return "Thank you for your purchase!";
      case 'failed':
        return "We couldn't process your payment. Please try again.";
      default:
        return "Processing your payment...";
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`max-w-md w-full p-8 rounded-xl shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          {getStatusIcon()}
          
          <h1 className="text-2xl font-bold mb-2">
            {status === 'completed' ? 'Order Confirmed!' : status === 'failed' ? 'Payment Failed' : 'Processing Payment'}
          </h1>
          
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {getStatusMessage()}
          </p>
          
          <div className={`mb-6 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className="mb-2">You will be redirected in <span className="font-bold text-purple-600">{countdown}</span> seconds...</p>
            
            <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 6) * 100}%` }}
              ></div>
            </div>
          </div>
         
        </div>
      </div>
      
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </div>
  );
};

export default Success;