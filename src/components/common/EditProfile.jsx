import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { ThemeContext } from "../../context/ThemeContext";
import { Camera } from "lucide-react";
import { axiosInstance } from "../../utils/axios";

const EditProfile = () => {
  const { theme } = useContext(ThemeContext);
  const { _id, role } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
        const response = await axiosInstance.get(`/usersall/getprofile/${role}/${_id}`, {
          withCredentials: true
        });
        setFormData(prevState => ({
          ...prevState,
          ...response.data.data,
        }));
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details");
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

  const handleImageClick = () => {
    // Programmatically click the hidden file input
    document.getElementById("profilePic").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      
      if (image) {
        data.append("file", image);
      }
      
      const response = await axiosInstance.put(
        `/usersall/editprofile/${role}/${_id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      
      if(response.data.success === true) {
        toast.success("Profile updated successfully!");
        if (role === "user") {
          navigate(`/user/${_id}/${role}`);
        } else {
          navigate(`/${role}/user/${_id}/${role}`);
        }
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`pb-10 px-4 sm:px-6 lg:px-8 mt-10 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
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
            <div className="relative">
              {/* Add onClick handler directly to the image container */}
              <div 
                className={`w-32 h-32 rounded-full overflow-hidden ring-4 ${
                  theme === 'dark' ? 'ring-gray-600' : 'ring-green-100'
                } relative cursor-pointer`}
                onClick={handleImageClick}
              >
                <img
                  src={formData.profilePic || "/default-profile.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity ${
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
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } ${isSubmitting && 'opacity-75 cursor-not-allowed'}`}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditProfile;
// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import { ThemeContext } from "../../context/ThemeContext";
// import { Camera } from "lucide-react";
// import { axiosInstance } from "../../utils/axios";

// const EditProfile = () => {
//   const { theme } = useContext(ThemeContext);
//   const { _id, role } = useParams();
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     profilePic: "",
//   });

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const [image, setImage] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const response = await axiosInstance.get(`/usersall/getprofile/${role}/${_id}`, {
//           withCredentials: true
//         });
//         setFormData(prevState => ({
//           ...prevState,
//           ...response.data.data,
//         }));
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//         toast.error("Failed to fetch user details");
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
//     setIsSubmitting(true);
//     try {
//       const data = new FormData();
//       data.append("name", formData.name);
//       data.append("email", formData.email);
//       data.append("phone", formData.phone);
      
//       if (image) {
//         data.append("file", image);
//       }
      
//       const response = await axiosInstance.put(
//         `/usersall/editprofile/${role}/${_id}`,
//         data,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           withCredentials: true,
//         }
//       );
      
//       if(response.data.success === true) {
//         toast.success("Profile updated successfully!");
//         if (role === "user") {
//           navigate(`/user/${_id}/${role}`);
//         } else {
//           navigate(`/${role}/user/${_id}/${role}`);
//         }
//       }
      
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Failed to update profile");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className={`pb-10 px-4 sm:px-6 lg:px-8 ${
//       theme === 'dark' ? 'bg-gray-900' : 'bg-white'
//     }`}>
//       <div className={`max-w-xl mx-auto ${
//         theme === 'dark' 
//           ? 'bg-gray-800 shadow-xl' 
//           : 'bg-white shadow-lg'
//       } rounded-2xl overflow-hidden`}>
//         <div className={`px-8 py-6 ${
//           theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
//         }`}>
//           <h2 className={`text-3xl font-bold text-center ${
//             theme === 'dark' ? 'text-white' : 'text-gray-800'
//           }`}>
//             Edit Profile
//           </h2>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-8 space-y-6">
//           <div className="flex flex-col items-center space-y-4">
//             <div className="relative group">
//               <div className={`w-32 h-32 rounded-full overflow-hidden ring-4 ${
//                 theme === 'dark' ? 'ring-gray-600' : 'ring-green-100'
//               } relative`}>
//                 <img
//                   src={formData.profilePic || "/default-profile.png"}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//                 <div className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
//                   theme === 'dark' ? 'bg-gray-900/70' : 'bg-black/50'
//                 }`}>
//                   <Camera className="w-8 h-8 text-white" />
//                 </div>
//               </div>
//               <input
//                 type="file"
//                 id="profilePic"
//                 name="profilePic"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </div>
//             <label htmlFor="profilePic" className={`text-sm ${
//               theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//             }`}>
//               Click to change profile picture
//             </label>
//           </div>

//           <div className="space-y-4">
//             <div>
//               <label className={`block text-sm font-medium mb-2 ${
//                 theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
//               }`}>
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 rounded-lg border ${
//                   theme === 'dark' 
//                     ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
//                     : 'bg-white border-gray-300 focus:border-green-500'
//                 } focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
//                 required
//               />
//             </div>

//             <div>
//               <label className={`block text-sm font-medium mb-2 ${
//                 theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
//               }`}>
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 rounded-lg border ${
//                   theme === 'dark' 
//                     ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
//                     : 'bg-white border-gray-300 focus:border-green-500'
//                 } focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
//                 required
//               />
//             </div>

//             <div>
//               <label className={`block text-sm font-medium mb-2 ${
//                 theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
//               }`}>
//                 Phone
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-2 rounded-lg border ${
//                   theme === 'dark' 
//                     ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
//                     : 'bg-white border-gray-300 focus:border-green-500'
//                 } focus:ring-2 focus:ring-green-200 outline-none transition-colors`}
//                 required
//               />
//             </div>
//           </div>

//           <div className="pt-4">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
//                 theme === 'dark'
//                   ? 'bg-green-600 hover:bg-green-700 text-white'
//                   : 'bg-green-500 hover:bg-green-600 text-white'
//               } ${isSubmitting && 'opacity-75 cursor-not-allowed'}`}
//             >
//               {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default EditProfile;
