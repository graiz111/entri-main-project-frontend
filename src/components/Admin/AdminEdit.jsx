import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AdminEdit = ({ entities, updateEntity }) => {
  const { role, id } = useParams(); // Extract role & ID from URL params
  const navigate = useNavigate();

  // Find entity by role & ID
  const entity = entities.find((item) => item.id === parseInt(id) && item.role === role);

  // Initialize state with existing entity details
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
  });

  // Populate form when entity is found
  useEffect(() => {
    if (entity) {
      setFormData({
        name: entity.name || "",
        email: entity.email || "",
        phone: entity.phone || "",
        status: entity.status || "Active",
      });
    }
  }, [entity]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateEntity(id, role, formData);
    alert(`${role} updated successfully!`);
    navigate(-1); // Go back to the previous page
  };

  if (!entity) {
    return <p className="text-center text-red-500">Entity not found!</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Edit {role}</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />

          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />

          <label className="block mb-2">Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />

          <label className="block mb-2">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Blocked">Blocked</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Update {role}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEdit;
