import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to cart page after 5 seconds
    const timer = setTimeout(() => {
      navigate("/cart");
    }, 5000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Payment Failed!</h1>
      <p>Your payment was not completed. You will be redirected to the cart page shortly.</p>
    </div>
  );
};

export default Failure;