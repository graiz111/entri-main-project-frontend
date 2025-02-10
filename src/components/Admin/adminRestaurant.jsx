import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    owner: "",
    location: "",
    email: "",
    phone: "",
    image: null
  });
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    owner: "",
    location: "",
    email: "",
    phone: "",
    image: null
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/restaurants', {
        withCredentials: true
      });
      setRestaurants(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching restaurants');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (restaurant) => {
    setEditingRestaurant(restaurant);
    setEditedData({
      name: restaurant.name,
      owner: restaurant.owner,
      location: restaurant.location,
      email: restaurant.email,
      phone: restaurant.phone,
      image: null
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    if (e.target.name === 'image') {
      setEditedData({ ...editedData, image: e.target.files[0] });
    } else {
      setEditedData({ ...editedData, [e.target.name]: e.target.value });
    }
  };

  const handleNewRestaurantChange = (e) => {
    if (e.target.name === 'image') {
      setNewRestaurant({ ...newRestaurant, image: e.target.files[0] });
    } else {
      setNewRestaurant({ ...newRestaurant, [e.target.name]: e.target.value });
    }
  };

  const updateRestaurant = async () => {
    try {
      setLoading(true);
      const updatedData = {
        name: editedData.name,
        owner: editedData.owner,
        location: editedData.location,
        email: editedData.email,
        phone: editedData.phone,
        image: editedData.image
      };

      await axios.put(
        `/api/admin/restaurants/${editingRestaurant._id}`,
        updatedData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      toast.success('Restaurant updated successfully');
      setShowEditModal(false);
      fetchRestaurants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating restaurant');
    } finally {
      setLoading(false);
    }
  };

  const addRestaurant = async () => {
    try {
      setLoading(true);
      const newRestaurantData = {
        name: newRestaurant.name,
        owner: newRestaurant.owner,
        location: newRestaurant.location,
        email: newRestaurant.email,
        phone: newRestaurant.phone,
        image: newRestaurant.image // image may need to be handled differently in the backend
      };

      await axios.post('/api/admin/restaurants', newRestaurantData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      toast.success('Restaurant added successfully');
      setShowAddModal(false);
      fetchRestaurants();
      setNewRestaurant({
        name: "",
        owner: "",
        location: "",
        email: "",
        phone: "",
        image: null
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding restaurant');
    } finally {
      setLoading(false);
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      setLoading(true);
      await axios.delete(`/api/admin/restaurants/${id}`, {
        withCredentials: true
      });
      toast.success('Restaurant deleted successfully');
      fetchRestaurants();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Registered Restaurants</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Add Restaurant
          </button>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white p-4 rounded-lg shadow mb-4 border">
              <div className="mb-2">
                <span className="font-bold">ID:</span> {restaurant.id}
              </div>
              <div className="mb-2">
                <span className="font-bold">Name:</span> {restaurant.name}
              </div>
              <div className="mb-2">
                <span className="font-bold">Owner:</span> {restaurant.owner}
              </div>
              <div className="mb-2">
                <span className="font-bold">Location:</span> {restaurant.location}
              </div>
              <div className="mb-2">
                <span className="font-bold">Email:</span> {restaurant.email}
              </div>
              <div className="mb-2">
                <span className="font-bold">Phone:</span> {restaurant.phone}
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => openEditModal(restaurant)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRestaurant(restaurant.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Restaurant Name</th>
                <th className="py-3 px-4 text-left">Owner</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{restaurant.id}</td>
                  <td className="py-3 px-4">{restaurant.name}</td>
                  <td className="py-3 px-4">{restaurant.owner}</td>
                  <td className="py-3 px-4">{restaurant.location}</td>
                  <td className="py-3 px-4">{restaurant.email}</td>
                  <td className="py-3 px-4">{restaurant.phone}</td>
                  <td className="py-3 px-4 text-center">
                    <div className='flex'>
                      <button
                        onClick={() => openEditModal(restaurant)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRestaurant(restaurant.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {restaurants.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No restaurants found.</p>
        )}
      </div>

      {/* Edit Restaurant Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Restaurant</h2>
            <input
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleEditInputChange}
              placeholder="Restaurant Name"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="file"
              name="image"
              onChange={handleEditInputChange}
              className="w-full border p-2 mb-3 rounded"
              accept="image/*"
            />
            <input
              type="text"
              name="location"
              value={editedData.location}
              onChange={handleEditInputChange}
              placeholder="Location"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="email"
              name="email"
              value={editedData.email}
              onChange={handleEditInputChange}
              placeholder="Email"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="tel"
              name="phone"
              value={editedData.phone}
              onChange={handleEditInputChange}
              placeholder="Phone"
              className="w-full border p-2 mb-3 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={updateRestaurant}
                disabled={loading}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Restaurant</h2>
            <input
              type="text"
              name="name"
              value={newRestaurant.name}
              onChange={handleNewRestaurantChange}
              placeholder="Restaurant Name"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="owner"
              value={newRestaurant.owner}
              onChange={handleNewRestaurantChange}
              placeholder="Owner Name"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="location"
              value={newRestaurant.location}
              onChange={handleNewRestaurantChange}
              placeholder="Location"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="email"
              name="email"
              value={newRestaurant.email}
              onChange={handleNewRestaurantChange}
              placeholder="Email"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="tel"
              name="phone"
              value={newRestaurant.phone}
              onChange={handleNewRestaurantChange}
              placeholder="Phone"
              className="w-full border p-2 mb-3 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addRestaurant}
                disabled={loading}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurant;
