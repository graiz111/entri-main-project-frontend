import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { ThemeContext } from "../../context/ThemeContext";
import { Camera } from "lucide-react";

const EditProfile = () => {
  const { theme } = useContext(ThemeContext)
const { _id,role } = useParams();
  
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    phone: "",
    profilePic: "",
  });
   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/usersall/getprofile/${role}/${_id}`, {
          withCredentials: true
        });
        setFormData(response.data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        
      }
    };
    fetchUserDetails();
  }, [_id, role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setFormData({ ...formData, profilePic: file ? URL.createObjectURL(file) : "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("phone", formData.phone);
      
      if (image) {
        data.append("file", image);
      }
      
      const response = await axios.put(
        `http://localhost:5001/api/usersall/editprofile/${role}/${_id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      
      if(response.data.success === true) {
        
      }
      navigate(`/${role}/user/${_id}/${role}`);
    } catch (error) {
      console.error("Error updating profile:", error);
     
    }
  };

  return (
    <div className={` py-12 px-4 sm:px-6 lg:px-8 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-xl mx-auto ${
        theme === 'dark' 
          ? 'bg-gray-800 shadow-xl' 
          : 'bg-white shadow-lg'
      } rounded-2xl overflow-hidden`}>
        <div className={`px-8 py-6 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
        }`}>
          <h2 className={`text-3xl font-bold text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Edit Profile
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-full overflow-hidden ring-4 ${
                theme === 'dark' ? 'ring-gray-600' : 'ring-green-100'
              } relative`}>
                <img
                  src={formData.profilePic || "/default-profile.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                  theme === 'dark' ? 'bg-gray-900/70' : 'bg-black/50'
                }`}>
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <label htmlFor="profilePic" className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Click to change profile picture
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 focus:border-green-500'
                } focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 focus:border-green-500'
                } focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                    : 'bg-white border-gray-300 focus:border-green-500'
                } focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default EditProfile;
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate} from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';


// const EditProfile = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);

//   const _id = searchParams.get("_id");
//   const role = searchParams.get("role");
//   console.log(_id,role,"fromin editpro");
  
//   const [formData, setFormData] = useState({
//     name: "",
//     password: "",
//     phone: "",
//     profilePic: "",
//   });
//   const [image, setImage] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5001/api/usersall/getprofile/${role}/${_id}`,{
//           withCredentials:true
//         });
//         console.log(response.data.data,"responfetchdata");
        
//         setFormData(response.data.data);
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       }
//     };
//     fetchUserDetails();
//   }, [_id, role]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     setFormData({ ...formData, profilePic: file ? URL.createObjectURL(file) : "" });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const data = new FormData();
  
//       // Append text fields
//       data.append("name", formData.name);
//       data.append("email", formData.email);
//       data.append("password", formData.password);
//       data.append("phone", formData.phone);
  
//       // Append image if selected
//       if (image) {
//         data.append("file", image);
//       }
  
//       // Send the API request
//       const response=await axios.put(
//         `http://localhost:5001/api/usersall/editprofile/${role}/${_id}`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );
//       console.log(response.data.success);
      
//       if(response.data.success===true){
//         toast.success("Profile updated successfully!");
//       }
//       navigate(`/${role}?${role}_id=${_id}`);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };
  

//   return (
//     <div className=" bg-gray-100 p-6">
//       <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-3xl font-bold text-center mb-6">Edit Profile</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="flex justify-center mb-4">
//             <label htmlFor="profilePic" className="cursor-pointer">
//               <img
//                 src={formData.profilePic || "/default-profile.png"}
//                 alt="Profile"
//                 className="w-32 h-32 rounded-full object-cover"
//               />
//               <input
//                 type="file"
//                 id="profilePic"
//                 name="profilePic"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//           </div>
//           <label className="block mb-2">Name:</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mb-4" required />
//           <label className="block mb-2">Email:</label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mb-4" required />
//           <label className="block mb-2">Phone:</label>
//           <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mb-4" required />
//           <button type="submit" className="w-full bg-green-400 text-white py-2 rounded hover:bg-blue-600 transition">Save Changes</button>
//         </form>
//       </div>
//       <ToastContainer/>
//     </div>
//   );
// };

// export default EditProfile;