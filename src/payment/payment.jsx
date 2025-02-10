import React from 'react';

const Payment = () => {
  const initiatePayment = async () => {
    try {
      // Step 1: Create an order on the backend
      const orderResponse = await fetch('http://localhost:5000/api/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 500 }), // Replace with dynamic amount in INR
      });

      const { order_id, currency, amount } = await orderResponse.json();

      // Step 2: Configure Razorpay options
      const options = {
        key: 'your_key_id', // Replace with Razorpay Key ID
        amount, // Amount in paise
        currency,
        name: 'Your Company Name',
        description: 'Test Payment',
        order_id, // Razorpay Order ID generated on the backend
        handler: async function (response) {
          // Step 3: Verify payment on the backend
          const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyResult = await verifyResponse.json();

          if (verifyResult.success) {
            alert('Payment Verified Successfully!');
          } else {
            alert('Payment Verification Failed!');
          }
        },
        prefill: {
          name: 'Customer Name', // Replace with dynamic customer name
          email: 'customer@example.com', // Replace with dynamic email
          contact: '9999999999', // Replace with dynamic contact number
        },
        theme: {
          color: '#F37254', // Customize color
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', function (response) {
        alert('Payment Failed! Please try again.');
      });
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <button onClick={initiatePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;
