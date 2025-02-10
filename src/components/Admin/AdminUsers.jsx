import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDelivery = () => {
  const [partners, setPartners] = useState([]);
  const [editingPartner, setEditingPartner] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedData, setEditedData] = useState({
    name: '',
    phone: '',
    location: '',
    isActive: true,
  });
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    phone: '',
    location: '',
    isActive: true,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/admin/delivery-partners', {
        withCredentials: true,
      });
      setPartners(response.data);
    } catch (err) {
      console.log('Error fetching partners:', err);
    }
  };

  const openEditForm = (partner) => {
    setEditingPartner(partner);
    setEditedData({
      name: partner.name,
      phone: partner.phone,
      location: partner.location,
      isActive: partner.isActive,
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  const updatePartner = async () => {
    try {
      await axios.put(
        'http://localhost:5001/api/admin/edit-partner',
        { _id: editingPartner._id, ...editedData },
        { withCredentials: true }
      );
      setShowEditModal(false);
      setEditingPartner(null);
      fetchPartners();
    } catch (err) {
      console.log('Error updating partner:', err);
    }
  };

  const deletePartner = async (_id) => {
    if (!window.confirm('Are you sure you want to delete this delivery partner?')) return;

    try {
      await axios.delete('http://localhost:5001/api/admin/delete-partner', {
        data: { _id },
        withCredentials: true,
      });
      fetchPartners();
    } catch (err) {
      console.log('Error deleting partner:', err);
    }
  };

  const handleNewPartnerChange = (e) => {
    setNewPartner({ ...newPartner, [e.target.name]: e.target.value });
  };

  const addPartner = async () => {
    try {
      await axios.post(
        'http://localhost:5001/api/admin/add-partner',
        { ...newPartner },
        { withCredentials: true }
      );
      setShowAddPartnerModal(false);
      fetchPartners();
    } catch (err) {
      console.log('Error adding partner:', err);
    }
  };

  const toggleActiveStatus = async (id, isActive) => {
    try {
      await axios.put(
        'http://localhost:5001/api/admin/toggle-partner-status',
        { id, isActive: !isActive },
        { withCredentials: true }
      );
      setPartners((prev) =>
        prev.map((partner) =>
          partner._id === id ? { ...partner, isActive: !isActive } : partner
        )
      );
    } catch (err) {
      console.log('Error updating partner status:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Delivery Partners</h2>
          <button
            onClick={() => setShowAddPartnerModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Add Partner
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{partner._id}</td>
                  <td className="py-3 px-4">{partner.name}</td>
                  <td className="py-3 px-4">{partner.phone}</td>
                  <td className="py-3 px-4">{partner.location}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleActiveStatus(partner._id, partner.isActive)}
                      className={`px-4 py-1 rounded-md ${
                        partner.isActive ? 'bg-green-500' : 'bg-red-500'
                      } text-white`}
                    >
                      {partner.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openEditForm(partner)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePartner(partner._id)}
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

        {partners.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No delivery partners found.</p>
        )}
      </div>

      {/* Add Partner Modal */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Partner</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleNewPartnerChange}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleNewPartnerChange}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              onChange={handleNewPartnerChange}
              className="w-full border p-2 mb-3 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddPartnerModal(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addPartner}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Partner Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Partner</h2>
            <input
              type="text"
              name="name"
              value={editedData.name}
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
              name="location"
              value={editedData.location}
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
                onClick={updatePartner}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDelivery;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editedData, setEditedData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//   });
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     password: "",
//   });

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   const fetchUserDetails = async () => {
//     try {
//       const response = await axios.get("http://localhost:5001/api/admin/allusers", {
//         withCredentials: true,
//       });
//       setUsers(response.data);
//     } catch (err) {
//       console.log("Error fetching users:", err);
//     }
//   };

//   const openEditForm = (user) => {
//     setEditingUser(user);
//     setEditedData({
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//     });
//     setShowEditModal(true);
//   };

//   const handleEditInputChange = (e) => {
//     setEditedData({ ...editedData, [e.target.name]: e.target.value });
//   };

//   const updateUser = async () => {
//     try {
//       await axios.put(
//         "http://localhost:5001/api/admin/edituser",
//         { _id: editingUser._id, ...editedData },
//         { withCredentials: true }
//       );
//       setShowEditModal(false);
//       setEditingUser(null);
//       fetchUserDetails();
//     } catch (err) {
//       console.log("Error updating user:", err);
//     }
//   };

//   const deleteUser = async (_id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await axios.delete("http://localhost:5001/api/admin/deleteuser", {
//         data: { _id },
//         withCredentials: true,
//       });
//       fetchUserDetails();
//     } catch (err) {
//       console.log("Error deleting user:", err);
//     }
//   };

//   const handleNewUserChange = (e) => {
//     setNewUser({ ...newUser, [e.target.name]: e.target.value });
//   };

//   const addUser = async () => {
//     try {
//       await axios.post(
//         "http://localhost:5001/api/admin/adduser",
//         { ...newUser },
//         { withCredentials: true }
//       );
//       setShowAddUserModal(false);
//       fetchUserDetails();
//     } catch (err) {
//       console.log("Error adding user:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-800">Users</h2>
//           <button
//             onClick={() => setShowAddUserModal(true)}
//             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
//           >
//             Add User
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <div className="md:hidden">
//             {users.map((user) => (
//               <div key={user._id} className="bg-white p-4 rounded-lg shadow mb-4 border">
//                 <div className="mb-2">
//                   <span className="font-bold">ID:</span> {user._id}
//                 </div>
//                 <div className="mb-2">
//                   <span className="font-bold">Name:</span> {user.name}
//                 </div>
//                 <div className="mb-2">
//                   <span className="font-bold">Email:</span> {user.email}
//                 </div>
//                 <div className="mb-2">
//                   <span className="font-bold">Phone:</span> {user.phone}
//                 </div>
//                 <div className="flex space-x-2 mt-3">
//                   <button
//                     onClick={() => openEditForm(user)}
//                     className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteUser(user._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="hidden md:block">
//             <table className="min-w-full bg-white border border-gray-300 rounded-lg">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="py-3 px-4 text-left">ID</th>
//                   <th className="py-3 px-4 text-left">Name</th>
//                   <th className="py-3 px-4 text-left">Email</th>
//                   <th className="py-3 px-4 text-left">Phone</th>
//                   <th className="py-3 px-4 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user._id} className="border-b hover:bg-gray-50 transition">
//                     <td className="py-3 px-4">{user._id}</td>
//                     <td className="py-3 px-4">{user.name}</td>
//                     <td className="py-3 px-4">{user.email}</td>
//                     <td className="py-3 px-4">{user.phone}</td>
//                     <td className="py-3 px-4 text-center">
//                       <button
//                         onClick={() => openEditForm(user)}
//                         className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => deleteUser(user._id)}
//                         className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {users.length === 0 && (
//           <p className="text-center text-gray-500 mt-4">No users found.</p>
//         )}
//       </div>

//       {/* Add User Modal */}
//       {showAddUserModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Add User</h2>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="text"
//               name="phone"
//               placeholder="Phone"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="text"
//               name="role"
//               placeholder="Role"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />

//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowAddUserModal(false)}
//                 className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={addUser}
//                 className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit User Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit User</h2>
//             <input
//               type="text"
//               name="name"
//               value={editedData.name}
//               onChange={handleEditInputChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               value={editedData.email}
//               onChange={handleEditInputChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="text"
//               name="phone"
//               value={editedData.phone}
//               onChange={handleEditInputChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="text"
//               name="role"
//               value={editedData.role}
//               onChange={handleEditInputChange}
//               className="w-full border p-2 mb-3 rounded"
//             />

//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={updateUser}
//                 className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminUsers;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editedData, setEditedData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//   });
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     password: "",
//     profilePic: null,
//   });

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   const fetchUserDetails = async () => {
//     try {
//       const response = await axios.get("http://localhost:5001/api/admin/allusers", {
//         withCredentials: true,
//       });
//       setUsers(response.data);
//     } catch (err) {
//       console.log("Error fetching users:", err);
//     }
//   };

//   const openEditForm = (user) => {
//     setEditingUser(user);
//     setEditedData({
//       name: user.name,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//     });
//     setShowEditModal(true);
//   };

//   const handleEditInputChange = (e) => {
//     setEditedData({ ...editedData, [e.target.name]: e.target.value });
//   };

//   const updateUser = async () => {
//     try {
//       await axios.put(
//         "http://localhost:5001/api/admin/edituser",
//         { _id: editingUser._id, ...editedData },
//         { withCredentials: true }
//       );
//       setShowEditModal(false);
//       setEditingUser(null);
//       fetchUserDetails();
//     } catch (err) {
//       console.log("Error updating user:", err);
//     }
//   };

//   const deleteUser = async (_id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await axios.delete("http://localhost:5001/api/admin/deleteuser", {
//         data: { _id },
//         withCredentials: true,
//       });
//       fetchUserDetails();
//     } catch (err) {
//       console.log("Error deleting user:", err);
//     }
//   };

//   const handleNewUserChange = (e) => {
//     if (e.target.name === "profilePic") {
//       setNewUser({ ...newUser, profilePic: e.target.files[0] });
//     } else {
//       setNewUser({ ...newUser, [e.target.name]: e.target.value });
//     }
//   };

//   const addUser = async () => {
//     const formData = new FormData();
//     formData.append("name", newUser.name);
//     formData.append("email", newUser.email);
//     formData.append("phone", newUser.phone);
//     formData.append("role", newUser.role);
//     formData.append("password", newUser.password);
//     if (newUser.profilePic) {
//       formData.append("profilePic", newUser.profilePic);
//     }

//     try {
//       await axios.post("http://localhost:5001/api/admin/adduser", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });
//       setShowAddUserModal(false);
//       fetchUserDetails();
//     } catch (err) {
//       console.log("Error adding user:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-800">Users</h2>
//           <button
//             onClick={() => setShowAddUserModal(true)}
//             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
//           >
//             Add User
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <div className="md:hidden">
//             {users.map((user) => (
//               <div key={user._id} className="bg-white p-4 rounded-lg shadow mb-4 border">
//                 <div className="mb-2">
//                   <span className="font-bold">ID:</span> {user._id}
//                 </div>
//                 <div className="mb-2">
//                   <span className="font-bold">Name:</span> {user.name}
//                 </div>
//                 <div className="mb-2">
//                   <span className="font-bold">Email:</span> {user.email}
//                 </div>
//                 <div className="mb-2">
//                   <span className="font-bold">Phone:</span> {user.phone}
//                 </div>
//                 <div className="flex space-x-2 mt-3">
//                   <button
//                     onClick={() => openEditForm(user)}
//                     className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => deleteUser(user._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="hidden md:block">
//             <table className="min-w-full bg-white border border-gray-300 rounded-lg">
//               <thead>
//                 <tr className="bg-gray-200">
//                   <th className="py-3 px-4 text-left">ID</th>
//                   <th className="py-3 px-4 text-left">Name</th>
//                   <th className="py-3 px-4 text-left">Email</th>
//                   <th className="py-3 px-4 text-left">Phone</th>
//                   <th className="py-3 px-4 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user._id} className="border-b hover:bg-gray-50 transition">
//                     <td className="py-3 px-4">{user._id}</td>
//                     <td className="py-3 px-4">{user.name}</td>
//                     <td className="py-3 px-4">{user.email}</td>
//                     <td className="py-3 px-4">{user.phone}</td>
//                     <td className="py-3 px-4 text-center">
//                       <button
//                         onClick={() => openEditForm(user)}
//                         className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => deleteUser(user._id)}
//                         className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {users.length === 0 && (
//           <p className="text-center text-gray-500 mt-4">No users found.</p>
//         )}
//       </div>

//       {/* Add User Modal */}
//       {showAddUserModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Add User</h2>
//             <input
//               type="text"
//               name="name"
//               placeholder="Name"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="text"
//               name="phone"
//               placeholder="Phone"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="text"
//               name="role"
//               placeholder="Role"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="file"
//               name="profilePic"
//               onChange={handleNewUserChange}
//               className="w-full border p-2 mb-3 rounded"
//             />

//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowAddUserModal(false)}
//                 className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={addUser}
//                 className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit User Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit User</h2>
//             <input
//               type="text"
//               name="name"
//               value={editedData.name}
//               onChange={handleEditInputChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="email"
//               name="email"
//               value={editedData.email}
//               onChange={handleEditInputChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="text"
//               name="phone"
//               value={editedData.phone}
//               onChange={handleEditInputChange}
//               className="w-full border p-2 mb-3 rounded"
//             />
//             <input
//               type="text"
//               name="role"
//               value={editedData.role}
//               onChange={handleEditInputChange}
//               className="w-full border p-2 mb-3 rounded"
//             />

//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={updateUser}
//                 className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminUsers;
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [editingUser, setEditingUser] = useState(null);
//   const [editedData, setEditedData] = useState({ name: "", email: "", phone: "" });
//   const [showAddUserModal, setShowAddUserModal] = useState(false);
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//     password: "",
//     profilePic: null,
//   });

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//   const fetchUserDetails = async () => {
//     try {
//       const response = await axios.get("http://localhost:5001/api/admin/allusers", {
//         withCredentials: true,
//       });
//       setUsers(response.data);
//     } catch (err) {
//       console.log("Error fetching users:", err);
//     }
//   };

//   const openEditForm = (user) => {
//     setEditingUser(user);
//     setEditedData({ name: user.name, email: user.email, phone: user.phone });
//   };

//   const handleInputChange = (e) => {
//     setEditedData({ ...editedData, [e.target.name]: e.target.value });
//   };

//   const updateUser = async () => {
//     try {
//       await axios.put(
//         "http://localhost:5001/api/admin/edituser",
//         { _id: editingUser._id, ...editedData },
//         { withCredentials: true }
//       );
//       setEditingUser(null);
//       fetchUserDetails();
//     } catch (err) {
//       console.log("Error updating user:", err);
//     }
//   };

//   const deleteUser = async (_id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;

//     try {
//       await axios.delete("http://localhost:5001/api/admin/deleteuser", {
//         data: { _id },
//         withCredentials: true,
//       });
//       fetchUserDetails();
//     } catch (err) {
//       console.log("Error deleting user:", err);
//     }
//   };

//   // Handle new user input
//   const handleNewUserChange = (e) => {
//     if (e.target.name === "profilePic") {
//       setNewUser({ ...newUser, profilePic: e.target.files[0] });
//     } else {
//       setNewUser({ ...newUser, [e.target.name]: e.target.value });
//     }
//   };

//   // Add new user
//   const addUser = async () => {
//     const formData = new FormData();
//     formData.append("name", newUser.name);
//     formData.append("email", newUser.email);
//     formData.append("phone", newUser.phone);
//     formData.append("role", newUser.role);
//     formData.append("password", newUser.password);
//     if (newUser.profilePic) {
//       formData.append("profilePic", newUser.profilePic);
//     }

//     try {
//       await axios.post("http://localhost:5001/api/admin/adduser", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });
//       setShowAddUserModal(false);
//       fetchUserDetails();
//     } catch (err) {
//       console.log("Error adding user:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-800">Users</h2>
//           <button
//             onClick={() => setShowAddUserModal(true)}
//             className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
//           >
//             Add User
//           </button>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-300 rounded-lg">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="py-3 px-4 text-left">ID</th>
//                 <th className="py-3 px-4 text-left">Name</th>
//                 <th className="py-3 px-4 text-left">Email</th>
//                 <th className="py-3 px-4 text-left">Phone</th>
//                 <th className="py-3 px-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id} className="border-b hover:bg-gray-50 transition">
//                   <td className="py-3 px-4">{user._id}</td>
//                   <td className="py-3 px-4">{user.name}</td>
//                   <td className="py-3 px-4">{user.email}</td>
//                   <td className="py-3 px-4">{user.phone}</td>
//                   <td className="py-3 px-4 text-center">
//                     <button
//                       onClick={() => openEditForm(user)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => deleteUser(user._id)}
//                       className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {users.length === 0 && <p className="text-center text-gray-500 mt-4">No users found.</p>}
//       </div>

//       {/* Add User Modal */}
//       {showAddUserModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Add User</h2>
//             <input type="text" name="name" placeholder="Name" onChange={handleNewUserChange} className="w-full border p-2 mb-3" />
//             <input type="email" name="email" placeholder="Email" onChange={handleNewUserChange} className="w-full border p-2 mb-3" />
//             <input type="text" name="phone" placeholder="Phone" onChange={handleNewUserChange} className="w-full border p-2 mb-3" />
//             <input type="text" name="role" placeholder="Role" onChange={handleNewUserChange} className="w-full border p-2 mb-3" />
//             <input type="password" name="password" placeholder="Password" onChange={handleNewUserChange} className="w-full border p-2 mb-3" />
//             <input type="file" name="profilePic" onChange={handleNewUserChange} className="w-full border p-2 mb-3" />

//             <div className="flex justify-end space-x-2">
//               <button onClick={() => setShowAddUserModal(false)} className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600">
//                 Cancel
//               </button>
//               <button onClick={addUser} className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminUsers;



