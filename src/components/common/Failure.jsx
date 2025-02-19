import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import { FaTimesCircle, FaShoppingCart, FaQuestionCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Failure = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(6); 
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
  
    toast.error("Payment failed. Please try again or contact support.");

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          navigate("/cart");
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className={`max-w-md w-full p-8 rounded-xl shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <FaTimesCircle className="text-red-500 text-6xl mb-4" />
          
          <h1 className="text-2xl font-bold mb-2">
            Payment Failed!
          </h1>
          
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your payment was not completed. Please check your payment details and try again.
          </p>
          
          <div className={`mb-6 p-4 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <p className="mb-2">You will be redirected to the cart page in <span className="font-bold text-purple-600">{countdown}</span> seconds...</p>
            
            <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 6) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate("/cart")}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              <FaShoppingCart />
              <span>Return to Cart</span>
            </button>
            
            <button
              onClick={() => navigate("/support")}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                theme === 'dark'
                  ? 'bg-purple-700 hover:bg-purple-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <FaQuestionCircle />
              <span>Contact Support</span>
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

export default Failure;