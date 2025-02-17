import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { NavLink,useLocation } from "react-router-dom";
import { axiosInstance } from "../../utils/axios";


const SettingsPage = () => {
    const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const restaurant_id = searchParams.get("restaurant_id");
  const [user, setUser] = useState({
    name: "",
    phone: "",
    profilePic: "",
  });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${restaurant_id}`);
        setUser(response.data);
        setPreview(response.data.profilePic);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [restaurant_id]);

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Preview image before upload
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("phone", user.phone);
    if (file) {
      formData.append("profilePic", file);
    }

    try {
      const response = await axiosInstance.put(`/users/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
      setUser(response.data);
      setPreview(response.data.profilePic);
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

      {/* Profile Picture Preview */}
      <div className="flex flex-col items-center mb-4">
        {preview ? (
          <img src={preview} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">No Image</div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-semibold">Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-semibold">Phone:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Profile Picture Upload */}
        <div>
          <label className="block text-gray-700 font-semibold">Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded-md" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-400 text-white py-2 rounded-md hover:bg-green-600 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
