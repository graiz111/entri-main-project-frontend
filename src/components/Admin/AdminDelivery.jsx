import React, { useState, useEffect } from 'react';
import { axiosInstance } from "../../utils/axios";
import { toast, ToastContainer } from 'react-toastify';

const AdminDelivery = () => {
  const [delivery, setDelivery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    phone: "",
    isActive: true,
  });
  const [newDelivery, setNewDelivery] = useState({
    name: "",
    email: "",
    phone: "",
    role: "delivery",
  });

  useEffect(() => {
    fetchDelivery();
  }, []);

  const fetchDelivery = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/alldelivery', {
        withCredentials: true
      });
      if (response.data.success) {
        setDelivery(response.data.data); 
      } else {
        toast.error('Failed to fetch delivery data');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching Delivery');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (delivery) => {
    setEditingDelivery(delivery);
    setEditedData({
      name: delivery.name,
      email: delivery.email,
      phone: delivery.phone,
      isActive: delivery.isActive,
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleNewDeliveryChange = (e) => {
    setNewDelivery({ ...newDelivery, [e.target.name]: e.target.value });
  };

  const updateDelivery = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        '/admin/edit-user',
        { _id: editingDelivery._id, ...editedData, role: "delivery" },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success('Delivery updated successfully');
        setShowEditModal(false);
        fetchDelivery();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating delivery');
    } finally {
      setLoading(false);
    }
  };

  const addDelivery = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        '/admin/add-user',
        { ...newDelivery, role: "delivery" },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success('Delivery added successfully');
        setShowAddModal(false);
        setNewDelivery({ name: "", email: "", phone: "", role: "delivery" });
        fetchDelivery();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error adding delivery');
    } finally {
      setLoading(false);
    }
  };

  const deleteDelivery = async (_id) => {
    if (!window.confirm('Are you sure you want to delete this delivery?')) return;

    try {
      setLoading(true);
      const response = await axiosInstance.delete('/admin/delete-user', {
        data: { _id, role: "delivery" },
        withCredentials: true
      });
      if (response.data.success) {
        toast.success('Delivery deleted successfully');
        fetchDelivery();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting delivery');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (_id, isActive) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        '/admin/toggle-user-status',
        { id: _id, isActive: !isActive, role: "delivery" },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success('Status updated successfully');
        fetchDelivery();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error toggling status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Registered Delivery Persons</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Add Delivery People
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-gray-200 rounded-full" role="status">
            </div>
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <>
            {delivery && delivery.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-3 px-4 text-left">ID</th>
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Phone</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {delivery.map((delivery) => (
                      <tr key={delivery._id} className="border-b hover:bg-gray-50 transition">
                        <td className="py-3 px-4">{delivery._id}</td>
                        <td className="py-3 px-4">{delivery.name}</td>
                        <td className="py-3 px-4">{delivery.email}</td>
                        <td className="py-3 px-4">{delivery.phone}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => openEditModal(delivery)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteDelivery(delivery._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleStatus(delivery._id, delivery.isActive)}
                            className={`px-4 py-2 rounded-md cursor-pointer ${delivery.isActive ? 'bg-gray-200 text-green-500' : 'bg-gray-200 text-red-500'}`}
                          >
                            {delivery.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-4">No Delivery found.</p>
            )}
          </>
        )}
      </div>

      {/* Edit Delivery Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Delivery</h2>
            <input
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleEditInputChange}
              placeholder="Delivery Name"
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
            <select
              name="isActive"
              value={editedData.isActive}
              onChange={handleEditInputChange}
              className="w-full border p-2 mb-3 rounded"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={updateDelivery}
                disabled={loading}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Delivery Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Delivery</h2>
            <input
              type="text"
              name="name"
              value={newDelivery.name}
              onChange={handleNewDeliveryChange}
              placeholder="Delivery Name"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="email"
              name="email"
              value={newDelivery.email}
              onChange={handleNewDeliveryChange}
              placeholder="Email"
              className="w-full border p-2 mb-3 rounded"
            />
             <input
              type="password"
              name="password"
              value={newDelivery.password}
              onChange={handleNewDeliveryChange}
              placeholder="password"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="tel"
              name="phone"
              value={newDelivery.phone}
              onChange={handleNewDeliveryChange}
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
                onClick={addDelivery}
                disabled={loading}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default AdminDelivery;
