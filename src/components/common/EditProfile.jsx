import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = ({ user, updateProfile }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    profilePic: user.profilePic || "",
  });

  const [image, setImage] = useState(null); // To store the new profile image
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setFormData({ ...formData, profilePic: file ? URL.createObjectURL(file) : "" });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData); // Assuming `updateProfile` is passed as a prop
    alert("Profile updated successfully!");
    navigate("/profile"); // Redirect after update
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            <label htmlFor="profilePic" className="cursor-pointer">
              <img
                src={formData.profilePic || "/default-profile.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name Field */}
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />

          {/* Email Field */}
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />

          {/* Phone Field */}
          <label className="block mb-2">Phone:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-400 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
