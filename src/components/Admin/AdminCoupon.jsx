import React, { useState, useEffect, useContext } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { axiosInstance } from '../../utils/axios';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercentage: '',
    expiryDate: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { theme } = useContext(ThemeContext);

  const fetchCoupons = async () => {
    try {
      const response = await axiosInstance.get('/admin/coupons');
      setCoupons(response.data);
    } catch (err) {
      setError('Failed to fetch coupons');
      setTimeout(() => setError(''), 3000);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/admin/addcoupons', newCoupon);
      if (response.data.success) {
        setSuccess('Coupon added successfully');
        setTimeout(() => setSuccess(''), 3000);
        setNewCoupon({ code: '', discountPercentage: '', expiryDate: '' });
        fetchCoupons();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add coupon');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const response = await axiosInstance.delete(`/admin/deletecoupons/${couponId}`);
      if (response.data.success) {
        setSuccess('Coupon deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchCoupons();
      }
    } catch (err) {
      setError('Failed to delete coupon');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen mt-24 max-w-7xl mx-auto px-4">
 
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

    
      <div className={`mb-6 rounded-lg shadow-md overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
      }`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Add New Coupon</h2>
        </div>
        <div className="p-4">
          <form onSubmit={handleAddCoupon} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Coupon Code"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                className={`p-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}
                required
              />
              <input
                type="number"
                placeholder="Discount Percentage"
                value={newCoupon.discountPercentage}
                onChange={(e) => setNewCoupon({...newCoupon, discountPercentage: e.target.value})}
                min="1"
                max="100"
                className={`p-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}
                required
              />
              <input
                type="date"
                value={newCoupon.expiryDate}
                onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                className={`p-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Coupon
            </button>
          </form>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div 
            key={coupon._id}
            className={`rounded-lg shadow-md overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'
            }`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{coupon.code}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {coupon.discountPercentage}% OFF
                  </p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCoupon(coupon._id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponManagement;