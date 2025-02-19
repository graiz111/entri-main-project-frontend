import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { axiosInstance } from '../../utils/axios';

const AdminRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    email: '',
    phone: '',
    password: '', 
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/resfetch', { withCredentials: true });
      setRestaurants(response.data.data);
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
      email: restaurant.email,
      phone: restaurant.phone,
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNewRestaurantChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateRestaurant = async () => {
    try {
      await axiosInstance.put(
        '/admin/edit-user', 
        { _id: editingRestaurant._id, ...editedData,role:'restaurant' },
        { withCredentials: true }
      );
      setShowEditModal(false);
      setEditingRestaurant(null);
      fetchRestaurants();
      toast.success('Restaurant updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating restaurant');
    }
  };

  const addRestaurant = async () => {
    try {
      await axiosInstance.post(
        '/admin/add-user', 
        { ...newRestaurant, role: 'restaurant' }, 
        { withCredentials: true }
      );
      setShowAddModal(false);
      setNewRestaurant({ name: '', email: '', phone: '', password: '' }); 
      fetchRestaurants();
      toast.success('Restaurant added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding restaurant');
    }
  };

  const deleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;

    try {
      await axiosInstance.delete('/admin/delete-user', {
        data: { _id: id, role: 'restaurant' }, 
        withCredentials: true,
      });
      fetchRestaurants();
      toast.success('Restaurant deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting restaurant');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Manage Restaurants</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Restaurant
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-gray-200 rounded-full" role="status">
          </div>
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="p-4 bg-white rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg">{restaurant.name}</h3>
              <p className="text-sm text-gray-500">Email: {restaurant.email}</p>
              <p className="text-sm text-gray-500">Phone: {restaurant.phone}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => openEditModal(restaurant)}
                  className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRestaurant(restaurant._id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

  
      {showEditModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Restaurant</h3>
            <input
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleEditInputChange}
              placeholder="Restaurant Name"
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={editedData.email}
              onChange={handleEditInputChange}
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <input
              type="text"
              name="phone"
              value={editedData.phone}
              onChange={handleEditInputChange}
              placeholder="Phone"
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={updateRestaurant}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Update
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

   
      {showAddModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add Restaurant</h3>
            <input
              type="text"
              name="name"
              value={newRestaurant.name}
              onChange={handleNewRestaurantChange}
              placeholder="Restaurant Name"
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={newRestaurant.email}
              onChange={handleNewRestaurantChange}
              placeholder="Email"
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <input
              type="password"
              name="password"
              value={newRestaurant.password}
              onChange={handleNewRestaurantChange}
              placeholder="Password"
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <input
              type="text"
              name="phone"
              value={newRestaurant.phone}
              onChange={handleNewRestaurantChange}
              placeholder="Phone"
              className="w-full px-4 py-2 mb-4 border rounded-md"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={addRestaurant}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default AdminRestaurant;
