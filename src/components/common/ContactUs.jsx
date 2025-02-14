import React, { useState, useEffect, useContext } from "react";
import emailjs from "@emailjs/browser";
import { ThemeContext } from "../../context/ThemeContext"; // Adjust path as needed

const ContactUs = () => {
  const { theme } = useContext(ThemeContext);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    message: "",
    type: "", // 'success' or 'error'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        message: "Please enter a valid email address",
        type: "error",
      });
      return false;
    }
    if (formData.message.length < 10) {
      setStatus({
        message: "Message must be at least 10 characters long",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        formData,
        "YOUR_PUBLIC_KEY"
      );

      setStatus({
        message: "Thank you for your message. We'll respond shortly.",
        type: "success",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        message: "Failed to send message. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getThemeClasses = () => ({
    container: `${theme === 'dark' ? 'bg-gray-900' : 'bg-none'}`,
    wrapper: `max-w-4xl mx-auto p-10 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`,
    form: `bg-opacity-80 rounded-lg shadow-xl p-8 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`,
    input: `w-full p-3 rounded-md transition duration-200 ${
      theme === 'dark'
        ? 'bg-gray-700 border-gray-600 text-white'
        : 'bg-white border-gray-300 text-gray-900'
    } focus:outline-none focus:ring-2 focus:ring-green-500`,
    button: `w-full py-3 px-6 rounded-md transition duration-200 ${
      loading ? 'opacity-70 cursor-not-allowed' : ''
    } ${
      theme === 'dark'
        ? 'bg-green-600 hover:bg-green-700'
        : 'bg-green-500 hover:bg-green-600'
    } text-white font-medium`,
  });

  const themeClasses = getThemeClasses();

  return (
    <div className={themeClasses.container}>
      <div className={themeClasses.wrapper}>
        <div className={themeClasses.form}>
          <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
          
          <div className="mb-8 space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">📍</span>
              <p>FOODIE BUDDIE, Kozhikode, Kerala</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">📞</span>
              <p>+91 9656527665</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">📧</span>
              <p>foodibuddiegapp@gmail.com</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={themeClasses.input}
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={themeClasses.input}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={themeClasses.input}
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className={themeClasses.input}
                />
              </div>
            </div>

            {status.message && (
              <div
                className={`p-4 rounded-md ${
                  status.type === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={themeClasses.button}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
// import React, { useState,useEffect } from "react";
// import emailjs from "@emailjs/browser";

// const ContactUs = () => {
//    useEffect(() => {
//           window.scrollTo(0, 0);
//       }, []);
      
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   const [successMessage, setSuccessMessage] = useState("");

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await emailjs.send(
//         "YOUR_SERVICE_ID", // Replace with EmailJS Service ID
//         "YOUR_TEMPLATE_ID", // Replace with EmailJS Template ID
//         formData,
//         "YOUR_PUBLIC_KEY" // Replace with your EmailJS Public Key
//       );

//       setSuccessMessage("Your complaint has been sent successfully!");
//       setFormData({ name: "", email: "", message: "" });
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   };

//   return (
//     <div className="  flex items-center justify-center p-6 ">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl w-full">
//         <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
//           Contact Foodie Buddie
//         </h2>

       
//         <div className="mb-6">
//           <p className="text-lg">
//             📍 <strong>Address:</strong> FOODIE BUDDIE,Kozhikode,kerala
//           </p>
//           <p className="text-lg">
//             📞 <strong>Phone:</strong> +91 9656527665
//           </p>
//           <p className="text-lg">
//             📧 <strong>Email:</strong> foodibuddiegapp@gmail.com
//           </p>
//         </div>

//         {/* Complaint Form */}
//         <h3 className="text-xl font-semibold text-gray-700 mb-4">
//           Register a Complaint or querry
//         </h3>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Your Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Your Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
//           />
//           <textarea
//             name="message"
//             placeholder="Your Complaint"
//             value={formData.message}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-green-500"
//           ></textarea>

//           <button
//             type="submit"
//             className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition"
//           >
//             Submit Complaint
//           </button>
//         </form>

//         {/* Success Message */}
//         {successMessage && (
//           <p className="text-green-600 font-semibold text-center mt-4">
//             {successMessage}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ContactUs;
