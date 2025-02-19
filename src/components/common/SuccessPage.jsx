import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import { FaCheckCircle, FaHome, FaHistory } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { orderId,userId } = useParams();
  const [countdown, setCountdown] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
     
    }, 1000);


    const countdownTimer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(countdownTimer);
          navigate(`/user/${userId}/user`);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    
    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="animate-pulse">
          <div className="h-16 w-16 rounded-full border-4 border-t-purple-500 border-purple-200 animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">✕</div>
          <h1 className="text-2xl font-bold mb-2">Error Occurred</h1>
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>{error}</p>
        
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`max-w-md w-full p-8 rounded-xl shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          
          <h1 className="text-2xl font-bold mb-2">
            Order Confirmed!
          </h1> <h1 className="text-2xl font-bold mb-2">
            Order Id : {orderId}
          </h1>
          
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Thank you for your order. Your order will be delivered shortly.
          </p>
          
          <div className={`mb-6 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className="text-center font-medium mb-4">
              Thank you for choosing Cash on Delivery (COD)!
            </p>
            
            <p className="mb-2">You will be redirected in <span className="font-bold text-purple-600">{countdown}</span> seconds...</p>
            
            <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 6) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
         
            
            <button
              onClick={() => navigate("orders")}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-purple-700 hover:bg-purple-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <FaHistory />
              <span>View Your Orders</span>
            </button>
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

export default SuccessPage;