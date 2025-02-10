import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID", // Replace with EmailJS Service ID
        "YOUR_TEMPLATE_ID", // Replace with EmailJS Template ID
        formData,
        "YOUR_PUBLIC_KEY" // Replace with your EmailJS Public Key
      );

      setSuccessMessage("Your complaint has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="  flex items-center justify-center p-6 ">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Contact Foodie Buddie
        </h2>

       
        <div className="mb-6">
          <p className="text-lg">
            📍 <strong>Address:</strong> FOODIE BUDDIE,Kozhikode,kerala
          </p>
          <p className="text-lg">
            📞 <strong>Phone:</strong> +91 9656527665
          </p>
          <p className="text-lg">
            📧 <strong>Email:</strong> foodibuddiegapp@gmail.com
          </p>
        </div>

        {/* Complaint Form */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Register a Complaint or querry
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
          <textarea
            name="message"
            placeholder="Your Complaint"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-green-500"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition"
          >
            Submit Complaint
          </button>
        </form>

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-600 font-semibold text-center mt-4">
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
