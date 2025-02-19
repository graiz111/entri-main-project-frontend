import React, { useState, useEffect } from 'react';
import {axiosInstance} from '../../utils/axios';
import { ToastContainer,toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    isActive: true,
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/userfetch', {
        withCredentials: true,
      });
      setUsers(response.data.data);
    } catch (err) {
      console.log('Error fetching users:', err);
    }
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setEditedData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const updateUser = async () => {
    try {
      await axiosInstance.put(
        '/admin/edit-user',
        { _id: editingUser._id, ...editedData },
        { withCredentials: true }
      );
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.log('Error updating user:', err);
    }
  };

  const deleteUser = async (_id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axiosInstance.delete('/admin/delete-user', {
        data: { _id , role:'user',},
       
      });
      fetchUsers();
    } catch (err) {
      console.log('Error deleting user:', err);
    }
  };

  const handleNewUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const addUser = async () => {
    try {
      await axiosInstance.post(
        '/admin/add-user',
        { ...newUser, role:'user', },
        { withCredentials: true }
      );
      setShowAddUserModal(false);
      fetchUsers();
    } catch (err) {
      console.log('Error adding user:', err);
    }
  };

  const toggleActiveStatus = async (id, isActive) => {
    try {
      await axiosInstance.put(
        '/admin/toggle-user-status',
        { id, isActive: !isActive, role:"user" },
       
        { withCredentials: true }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isActive: !isActive } : user
        )
      );
    } catch (err) {
      console.log('Error updating user status:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">USERS</h2>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{user._id}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">{user.role}</td>
               
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openEditForm(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No users found.</p>
        )}
      </div>


      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add User</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleNewUserChange}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleNewUserChange}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleNewUserChange}
              className="w-full border p-2 mb-3 rounded"
            />  <input
            type="text"
            name="password"
            placeholder="password"
            onChange={handleNewUserChange}
            className="w-full border p-2 mb-3 rounded"
          />
            <input
              type="text"
              name="role"
              placeholder="Role"
              onChange={handleNewUserChange}
              className="w-full border p-2 mb-3 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addUser}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit User</h2>
            <input
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleEditInputChange}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="email"
              name="email"
              value={editedData.email}
              onChange={handleEditInputChange}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="phone"
              value={editedData.phone}
              onChange={handleEditInputChange}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="role"
              value={editedData.role}
              onChange={handleEditInputChange}
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
                onClick={updateUser}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default AdminUsers;
