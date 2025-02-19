
// src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import { axiosInstance } from "../utils/axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCartCount = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/cart/cart/${userId}`);
      if (response.data.success && response.data.data && response.data.data.items) {
        setCartItems(response.data.data.items);
        setCartCount(response.data.data.items.length);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      cartCount, 
      fetchCartCount, 
      updateCartCount,
      loading 
    }}>
      {children}
    </CartContext.Provider>
  );
};