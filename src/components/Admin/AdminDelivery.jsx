import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDelivery = () => {
  const [Delivery, setDelivery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [newDelivery, setNewDelivery] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchDelivery();
  }, []);

  const fetchDelivery = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/admin/alldelivery', {
        withCredentials: true
      });
      setDelivery(response.data);
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
      const updatedData = {
        name: editedData.name,
        email: editedData.email,
        phone: editedData.phone,
      };

      await axios.put(`http://localhost:5001/api/admin/delivery/${editingDelivery._id}`, updatedData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      toast.success('Delivery updated successfully');
      setShowEditModal(false);
      fetchDelivery();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating delivery');
    } finally {
      setLoading(false);
    }
  };

  const addDelivery = async () => {
    try {
      setLoading(true);
      const newDeliveryData = {
        name: newDelivery.name,
        phone: newDelivery.phone,
        email: newDelivery.email,
      };

      await axios.post('http://localhost:5001/api/admin/adddelivery', newDeliveryData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      toast.success('Delivery added successfully');
      setShowAddModal(false);
      fetchDelivery();
      setNewDelivery({
        name: "",
        email: "",
        phone: "",
      });
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
  
      // Send the _id in the body of the DELETE request
      await axios.delete(
        `http://localhost:5001/api/admin/deletedelivery`, 
        { 
          data: { _id },  // Send the _id in the request body using 'data'
          withCredentials: true  // Include credentials for authentication
        }
      );
  
      toast.success('Delivery deleted successfully');
      fetchDelivery();  // Refresh the list of deliveries after deletion
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting delivery');
    } finally {
      setLoading(false);  // Stop loading
    }
  };
  

  const toggleStatus = async (id, isActive) => {
    try {
      setLoading(true);
      const status = isActive ? 'false' : 'true'; // Toggle the status
  
      const response = await axios.put(
        `http://localhost:5001/api/admin/delivery/${id}/status`, // Use the delivery ID in the URL
        { isActive: status }, // Send the status in the request body
        { withCredentials: true }
      );
  
      // toast.success(`Status updated to ${status === 'true' ? 'Active' : 'Inactive'}`);
      fetchDelivery(); // Fetch the latest data after updating the status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating status');
    } finally {
      setLoading(false); // Always stop loading
    }
  };
  


  return (
    <div className="p-6">
      <div className=" mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Registered Delivery Persons</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Add Delivery People
          </button>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {Delivery.map((delivery) => (
            <div key={delivery.id} className="bg-white p-4 rounded-lg shadow mb-4 border">
              <div className="mb-2">
                <span className="font-bold">ID:</span> {delivery._id}
              </div>
              <div className="mb-2">
                <span className="font-bold">Name:</span> {delivery.name}
              </div>
             
              <div className="mb-2">
                <span className="font-bold">Email:</span> {delivery.email}
              </div>
              <div className="mb-2">
                <span className="font-bold">Phone:</span> {delivery.phone}
              </div>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => openEditModal(delivery)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteDelivery(delivery._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
              <div className="mb-2">
                  <span className="font-bold ">Status:</span>
                  <button
                    onClick={() => toggleStatus(delivery._id, delivery.isActive)}
                    className={`ml-2 px-2 py-1 rounded-md mt-2 ${delivery.isActive === 'true' ? 'bg-gray-200 text-green-500' : 'bg-gray-200 text-red-500'} `}
                  >
                    {delivery.isActive === 'true' ? 'Active' : 'Inactive'}
                  </button>
              </div>
                 
              
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-auto ">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Person Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-center">Actions</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {Delivery.map((delivery) => (
                <tr key={delivery.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">{delivery._id}</td>
                <td className="py-3 px-4">{delivery.name}</td>
                <td className="py-3 px-4">{delivery.email}</td>
                <td className="py-3 px-4">{delivery.phone}</td>
                
                <td className="py-3 px-4 text-center">
                  <div className="flex">
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
                  </div>
                </td>
                <td className='py-3 px-4'>
                  <button
                    onClick={() => toggleStatus(delivery._id, delivery.isActive)}
                    className={`px-4 py-2 rounded-md cursor-pointer ${delivery.isActive === 'true' ? 'bg-gray-200 text-green-500' : 'bg-gray-200 text-red-500'}`}
                  >
                    {delivery.isActive === 'true' ? 'Active' : 'Inactive'}
                  </button>
                </td>
                
              </tr>
              
              ))}
            </tbody>
          </table>
        </div>

        {Delivery.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No Delivery found.</p>
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
              type="text"
              name="owner"
              value={newDelivery.owner}
              onChange={handleNewDeliveryChange}
              placeholder="Owner Name"
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="location"
              value={newDelivery.location}
              onChange={handleNewDeliveryChange}
              placeholder="Location"
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
    </div>
  );
};

export default AdminDelivery;
