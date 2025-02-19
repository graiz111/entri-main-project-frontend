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
            (response,"responseitems");
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
