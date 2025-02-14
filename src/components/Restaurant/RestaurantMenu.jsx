import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {  useParams } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import {axiosInstance} from '../../utils/axios.js'

const RestaurantMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '', image: null, imageUrl: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const { theme } = useContext(ThemeContext);
    const { _id,role } = useParams();


    useEffect(() => {
        fetchMenuItems();
    }, []);

   
  
const fetchMenuItems = async () => {
    try {
      const response = await axiosInstance.get(`/restaurantadd/getallitemsuser/${_id}`);
      setMenuItems(response.data.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setErrorMessage("Failed to fetch menu items");
    }
  };

    // Keeping all other handler functions the same as in your original code
    const handleAddItemClick = () => {
        setIsAddItemModalOpen(true);
        setNewItem({ name: '', description: '', price: '', image: null, imageUrl: '' });
        setErrorMessage('');
    };

    const handleEditItemClick = (item) => {
        setIsEditItemModalOpen(true);
        setSelectedItem(item);
        setNewItem({ 
            name: item.name, 
            description: item.description, 
            price: item.price, 
            imageUrl: item.itemPic 
        });
        setErrorMessage('');
    };

    const handleCloseModal = () => {
        setIsAddItemModalOpen(false);
        setIsEditItemModalOpen(false);
        setNewItem({ name: '', description: '', price: '', image: null, imageUrl: '' });
        setErrorMessage('');
    };

    const handleInputChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewItem({ 
                ...newItem, 
                image: file, 
                imageUrl: URL.createObjectURL(file) 
            });
        }
    };

    const handleSaveItem = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('description', newItem.description);
            formData.append('price', newItem.price);
            
            if (newItem.image) {
                formData.append('file', newItem.image);
            }

            const response = await axiosInstance.post('/restaurantadd/additem', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            fetchMenuItems();
            handleCloseModal();
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error saving item');
        }
    };

    const handleUpdateItem = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newItem.name);
            formData.append('description', newItem.description);
            formData.append('price', newItem.price);
            formData.append('restaurant_id', _id);

            if (newItem.image) {
                formData.append('file', newItem.image);
            }

            const response = await axiosInstance.put(`/restaurantadd/updateitem/${selectedItem._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                
                
               
            });
            console.log(response,"responseitems");
            if(response.data.success===true){
                fetchMenuItems();
                handleCloseModal();
            }

          
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Error updating item');
        }
    };

    const handleDeleteItem = async (item_id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axiosInstance.delete(`/restaurantadd/deleteitem/${item_id}`);
                fetchMenuItems();
                setErrorMessage('');
            } catch (error) {
                setErrorMessage('Failed to delete item');
            }
        }
    };

    return (
        <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center ">
                    <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Restaurant Menu
                    </h1>
                    <button 
                        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                            theme === 'dark' 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                        onClick={handleAddItemClick}
                    >
                        Add New Item
                    </button>
                </div>

                {errorMessage && (
                    <div className={`p-4 rounded-lg mb-6 ${
                        theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                    }`}>
                        {errorMessage}
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {menuItems.map((item) => (
                        <div 
                            key={item._id} 
                            className={`rounded-xl shadow-lg transition-all duration-300 ${
                                theme === 'dark' 
                                    ? 'bg-gray-800 hover:bg-gray-700' 
                                    : 'bg-white hover:shadow-xl'
                            }`}
                        >
                            <img 
                                src={item.itemPic} 
                                alt={item.name} 
                                className="w-full h-48 object-cover rounded-t-xl"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                                <p className={`text-lg font-medium mb-2 ${
                                    theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                }`}>
                                    Rs. {item.price}/-
                                </p>
                                <p className={`mb-4 ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {item.description}
                                </p>
                                <div className="flex gap-2">
                                    <button 
                                        className={`flex-1 py-2 rounded-md transition-colors duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-blue-600 hover:bg-blue-700'
                                                : 'bg-blue-500 hover:bg-blue-600'
                                        } text-white`}
                                        onClick={() => handleEditItemClick(item)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className={`flex-1 py-2 rounded-md transition-colors duration-300 ${
                                            theme === 'dark'
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-red-500 hover:bg-red-600'
                                        } text-white`}
                                        onClick={() => handleDeleteItem(item._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal for Adding/Editing Items */}
                {(isAddItemModalOpen || isEditItemModalOpen) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                        <div className={`max-w-md w-full rounded-xl p-6 ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                            <h2 className="text-2xl font-bold mb-6">
                                {isAddItemModalOpen ? 'Add New Item' : 'Edit Item'}
                            </h2>
                            <form className="space-y-4">
                                {newItem.imageUrl && (
                                    <img 
                                        src={newItem.imageUrl} 
                                        alt="Preview" 
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={newItem.name} 
                                    placeholder="Item Name" 
                                    onChange={handleInputChange} 
                                    className={`w-full p-3 rounded-lg border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300'
                                    }`}
                                    required 
                                />
                                <textarea 
                                    name="description" 
                                    value={newItem.description} 
                                    placeholder="Description" 
                                    onChange={handleInputChange} 
                                    className={`w-full p-3 rounded-lg border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300'
                                    }`}
                                    required
                                />
                                <input 
                                    type="text" 
                                    name="price" 
                                    value={newItem.price} 
                                    placeholder="Price" 
                                    onChange={handleInputChange} 
                                    className={`w-full p-3 rounded-lg border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-white border-gray-300'
                                    }`}
                                    required 
                                />
                                <input 
                                    type="file" 
                                    name="image" 
                                    onChange={handleImageChange} 
                                    className={`w-full p-3 ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                />

                                <div className="flex justify-end gap-3 mt-6">
                                    <button 
                                        type="button" 
                                        onClick={handleCloseModal}
                                        className={`px-4 py-2 rounded-lg ${
                                            theme === 'dark'
                                                ? 'bg-gray-600 hover:bg-gray-700'
                                                : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={isAddItemModalOpen ? handleSaveItem : handleUpdateItem}
                                        className={`px-4 py-2 rounded-lg text-white ${
                                            theme === 'dark'
                                                ? 'bg-green-600 hover:bg-green-700'
                                                : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                    >
                                        {isAddItemModalOpen ? 'Save' : 'Update'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantMenu;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {useLocation } from "react-router-dom";

// const RestaurantMenu = () => {
//     const [menuItems, setMenuItems] = useState([]);
//     const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
//     const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
//     const [selectedItem, setSelectedItem] = useState(null);
//     const [newItem, setNewItem] = useState({ name: '', description: '', price: '', image: null, imageUrl: '' });
//     const [errorMessage, setErrorMessage] = useState('');

//     const location = useLocation();
//     const searchParams = new URLSearchParams(location.search);
//     const restaurant_id = searchParams.get("restaurant_id");
    
    
//     useEffect(() => {
//         fetchMenuItems();
//     }, []);

//     const fetchMenuItems = async () => {
//         console.log("fetchMenuItems");
        
//         try {
//             const response = await axios.get(`http://localhost:5001/api/restaurantadd/getallitems/${restaurant_id}`,{
//                 withCredentials: true
//             });
//             console.log("responseresmenu",response);
            
//             setMenuItems(response.data.data);
//         } catch (error) {
//             console.error('Error fetching menu items:', error);
//             setErrorMessage('Failed to fetch menu items');
//         }
//     };

//     const handleAddItemClick = () => {
//         setIsAddItemModalOpen(true);
//         setNewItem({ name: '', description: '', price: '', image: null, imageUrl: '' });
//         setErrorMessage('');
//     };

//     const handleEditItemClick = (item) => {
//         setIsEditItemModalOpen(true);
//         setSelectedItem(item);
//         setNewItem({ 
//             name: item.name, 
//             description: item.description, 
//             price: item.price, 
//             imageUrl: item.itemPic 
//         });
//         setErrorMessage('');
//     };

//     const handleCloseModal = () => {
//         setIsAddItemModalOpen(false);
//         setIsEditItemModalOpen(false);
//         setNewItem({ name: '', description: '', price: '', image: null, imageUrl: '' });
//         setErrorMessage('');
//     };

//     const handleInputChange = (e) => {
//         setNewItem({ ...newItem, [e.target.name]: e.target.value });
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setNewItem({ 
//                 ...newItem, 
//                 image: file, 
//                 imageUrl: URL.createObjectURL(file) 
//             });
//         }
//     };

//     const handleSaveItem = async () => {
//         try {
//             const formData = new FormData();
//             formData.append('name', newItem.name);
//             formData.append('description', newItem.description);
//             formData.append('price', newItem.price);
            

//             if (newItem.image) {
//                 formData.append('file', newItem.image);
//             }

//             const response = await axios.post('http://localhost:5001/api/restaurantadd/additem', formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//                 withCredentials: true
//             });

//             console.log('Item saved:', response.data);
//             fetchMenuItems();
//             handleCloseModal();
//         } catch (error) {
//             console.error('Error saving item:', error);
//             setErrorMessage(error.response?.data?.message || 'Error saving item');
//         }
//     };

//     const handleUpdateItem = async () => {
//         try {
//             const formData = new FormData();
//             formData.append('name', newItem.name);
//             formData.append('description', newItem.description);
//             formData.append('price', newItem.price);
//             formData.append('restaurant_id', restaurant_id);

//             if (newItem.image) {
//                 formData.append('file', newItem.image);
//             }

//             const response = await axios.put(`http://localhost:5001/api/restaurantadd/updateitem/${selectedItem._id}`, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//                 withCredentials: true
//             });

//             console.log('Item updated:', response.data);
//             fetchMenuItems();
//             handleCloseModal();
//         } catch (error) {
//             console.error('Error updating item:', error);
//             setErrorMessage(error.response?.data?.message || 'Error updating item');
//         }
//     };

//     const handleDeleteItem = async (item_id) => {
//         if (window.confirm('Are you sure you want to delete this item?')) {
//             try {
//                 await axios.delete(`http://localhost:5001/api/restaurantadd/deleteitem/${item_id}`, {
//                     withCredentials: true
//                 });
//                 fetchMenuItems();
//                 setErrorMessage('')
//             } catch (error) {
//                 console.error('Error deleting item:', error);
//                 setErrorMessage('Failed to delete item');
//             }
//         }
//     };

//     return (
//         <div className="p-6 relative">
//             <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Restaurant Menu</h1>
//             <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 mb-3 absolute top-0 right-10" onClick={handleAddItemClick}>
//                 Add Item
//             </button>

//             {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

//             <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//                 {menuItems.map((item) => (
//                     <div key={item._id} className="bg-white p-4 rounded-xl shadow-xl flex flex-col justify-around hover:shadow-lg transition duration-300">
//                         <img src={item.itemPic} alt={item.name} className="max-w-80 max-h-60 mx-auto object-cover rounded-md" />
//                         <h2 className="text-xl font-semibold mt-3">{item.name}</h2>
//                         <p className="text-gray-600">Rs:{item.price}/-</p>
//                         <p className="text-gray-600">{item.description}</p>
//                         <div className="flex gap-2">
//                             <button className="mt-3 w-full bg-green-400 text-white py-2 rounded-md hover:bg-green-600 transition" onClick={() => handleEditItemClick(item)}>
//                                 Edit
//                             </button>
//                             <button className="mt-3 w-full bg-red-400 text-white py-2 rounded-md hover:bg-red-600 transition" onClick={() => handleDeleteItem(item._id)}>
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {isAddItemModalOpen && (
//                 <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-orange-200 p-8 rounded-lg">
//                         <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
//                         <form>
//                             {newItem.imageUrl && (
//                                 <img src={newItem.imageUrl} alt="Preview" className="max-h-60 max-w-60 mx-auto object-cover rounded-md mb-4" />
//                             )}
//                             <input type="text" name="name" value={newItem.name} placeholder="Item Name" onChange={handleInputChange} className="w-full mb-4 border p-2 rounded-xl" required />
//                             <textarea name="description" value={newItem.description} placeholder="Description" onChange={handleInputChange} className="w-full mb-4 border p-2 rounded-xl" required></textarea>
//                             <input type="text" name="price" value={newItem.price} placeholder="Price" onChange={handleInputChange} className="w-full mb-4 border p-2 rounded-xl" required />
//                             <input type="file" name="image" onChange={handleImageChange} className="w-full mb-4 border p-2 border-none" />

//                             <div className="flex justify-end">
//                                 <button type="button" onClick={handleCloseModal} className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
//                                     Cancel
//                                 </button>
//                                 <button type="button" onClick={handleSaveItem} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                                     Save
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {isEditItemModalOpen && (
//                 <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-orange-200 p-8 rounded-lg">
//                         <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
//                         <form>
//                             {newItem.imageUrl && (
//                                 <img src={newItem.imageUrl} alt="Preview" className="max-h-60 max-w-60 mx-auto object-cover rounded-md mb-4" />
//                             )}
//                             <input type="text" name="name" value={newItem.name} placeholder="Item Name" onChange={handleInputChange} className="w-full mb-4 border p-2 rounded-xl" required />
//                             <textarea name="description" value={newItem.description} placeholder="Description" onChange={handleInputChange} className="w-full mb-4 border p-2 rounded-xl" required></textarea>
//                             <input type="text" name="price" value={newItem.price} placeholder="Price" onChange={handleInputChange} className="w-full mb-4 border p-2 rounded-xl" required />
//                             <input type="file" name="image" onChange={handleImageChange} className="w-full mb-4 border p-2 border-none" />

//                             <div className="flex justify-end">
//                                 <button type="button" onClick={handleCloseModal} className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">
//                                     Cancel
//                                 </button>
//                                 <button type="button" onClick={handleUpdateItem} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
//                                     Update
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RestaurantMenu;


