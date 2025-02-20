import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext'; // Adjust path as needed
import { axiosInstance } from '../../utils/axios';

const UserAddress = () => {
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState([]); // Initialize as empty array
  const [editMode, setEditMode] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const params = new URLSearchParams(window.location.search);
const userId = params.get('user_id');
// (userId,"inaddressaddd");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [formData, setFormData] = useState({
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    country: 'India'
  });

 
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.post('/user/addresses', {
        
        user_id: userId 
      });
      
      if (response.data.success && Array.isArray(response.data.addresses)) {
        setAddresses(response.data.addresses);
      } else {
        setAddresses([]);
        console.error('Invalid address data received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]); 
      setMessage({ 
        type: 'error', 
        text: 'Failed to load addresses or no address available add one '
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = async (addressId) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/user/addresses', {
        
        address_id: addressId
      });
      
      if (response.data.success && response.data.address) {
        setFormData(response.data.address);
        setCurrentAddressId(addressId);
        setEditMode(true);
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Error loading address data'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      phone: '',
      country: 'India'
    });
    setEditMode(false);
    setCurrentAddressId(null);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let response;
      
      
      if (editMode) {
        response = await axiosInstance.post('/user/addresses', {
          action: 'edit',
          address_id: currentAddressId,
          ...formData
        });
      } else {
        response = await axiosInstance.post('/user/addresses', {
          action: 'add',
          user_id: userId,
          ...formData
        });
      }
      
      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: editMode ? 'Address updated successfully!' : 'Address added successfully!'
        });
        
        setFormData({
          address_line_1: '',
          address_line_2: '',
          city: '',
          state: '',
          postal_code: '',
          phone: '',
          country: 'India'
        });
        
        if (editMode) {
          setEditMode(false);
          setCurrentAddressId(null);
        }
        
        fetchAddresses();
      } else {
        throw new Error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Error processing address'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
   
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete('/user/deladdresses', {
          data: { addressId: addressId }, 
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
      });
      
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Address deleted successfully!'
        });
        
        fetchAddresses();
        
        if (currentAddressId === addressId) {
          handleCancel();
        }
      } else {
        throw new Error(response.data.message || 'Failed to delete address');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Error deleting address'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeStyles = () => {
    return {
      container: `p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`,
      card: `max-w-3xl mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-100'} shadow-lg rounded-lg p-6 mb-8`,
      heading: `text-3xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`,
      subheading: `text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`,
      label: `block text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`,
      input: `w-full p-3 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'} rounded-lg mt-2`,
      button: {
        primary: `${isLoading ? 'bg-gray-500' : theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-lg transition`,
        secondary: `${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'} text-white px-4 py-2 rounded-lg transition ml-3`,
        edit: `${theme === 'dark' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-3 py-1 rounded-lg transition text-sm`,
        delete: `${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white px-3 py-1 rounded-lg transition text-sm ml-2`
      },
      message: {
        success: `mt-4 p-3 bg-green-100 text-green-700 rounded-lg ${theme === 'dark' ? 'bg-green-900 text-green-200' : ''}`,
        error: `mt-4 p-3 bg-red-100 text-red-700 rounded-lg ${theme === 'dark' ? 'bg-red-900 text-red-200' : ''}`
      },
      addressCard: `${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} p-4 rounded-lg shadow mb-4`,
      addressText: `${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`
    };
  };

  const styles = getThemeStyles();

  return (
    <div className={styles.container}>
      {addresses.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.subheading}>Your Addresses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(address => (
              <div key={address._id} className={styles.addressCard}>
                <div className={styles.addressText}>
                  <p className="font-medium">{address.address_line_1}</p>
                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                  <p>{address.city}, {address.state} {address.postal_code}</p>
                  <p>{address.country}</p>
                  <p className="mt-2">Phone: {address.phone}</p>
                </div>
                <div className="mt-3">
                  <button 
                    onClick={() => handleEdit(address._id)}
                    className={styles.button.edit}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(address._id)}
                    className={styles.button.delete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div id="addressForm" className={styles.card}>
        <h2 className={styles.heading}>
          {editMode ? 'Edit Address' : 'Add New Address'}
        </h2>

        {message.text && (
          <div className={styles.message[message.type]}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="address_line_1" className={styles.label}>Address Line 1 *</label>
            <input
              id="address_line_1"
              name="address_line_1"
              type="text"
              value={formData.address_line_1}
              onChange={handleChange}
              className={styles.input}
              placeholder="House/Flat No., Building Name, Street"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address_line_2" className={styles.label}>Address Line 2</label>
            <input
              id="address_line_2"
              name="address_line_2"
              type="text"
              value={formData.address_line_2 || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="Landmark, Area (Optional)"
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className={styles.label}>City *</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className={styles.input}
                placeholder="City"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className={styles.label}>State *</label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                className={styles.input}
                placeholder="State"
                required
              />
            </div>
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="postal_code" className={styles.label}>Postal Code *</label>
              <input
                id="postal_code"
                name="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={handleChange}
                className={styles.input}
                placeholder="Postal Code"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className={styles.label}>Phone Number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                placeholder="Contact Number"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="country" className={styles.label}>Country</label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              className={styles.input}
              disabled
            />
          </div>

          <div className="flex">
            <button
              type="submit"
              disabled={isLoading}
              className={styles.button.primary}
            >
              {isLoading ? 'Saving...' : editMode ? 'Update Address' : 'Save Address'}
            </button>
            
            {editMode && (
              <button
                type="button"
                onClick={handleCancel}
                className={styles.button.secondary}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAddress;