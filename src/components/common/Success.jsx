import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {axiosInstance} from "../../utils/axios"; // Adjust the import path
import { toast } from "react-toastify";

const Success = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Extract userId from the URL
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // Extract session_id from query params

  useEffect(() => {
    const handleSuccess = async () => {
      console.log("entered success page ");
      
      try {
        // Verify the payment session with your backend
        const response = await axiosInstance.get(`/payment/session-status?session_id=${sessionId}`);
        if (response.data.success) {
          // Clear the cart
          await axiosInstance.delete(`/cart/clearcart/${userId}`);
          toast.success("Payment successful! Your cart has been cleared.");
        } else {
          toast.error("Payment verification failed.");
        }
      } catch (error) {
        console.error("Error verifying payment or clearing cart:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        // Redirect to the user's home page
        navigate(`/user/${userId}/user`);
      }
    };

    handleSuccess();
  }, [navigate, userId, sessionId]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Payment Successful!</h1>
      <p>You will be redirected shortly.</p>
      
    </div>
  );
};

export default Success;