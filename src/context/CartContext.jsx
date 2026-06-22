import React, { createContext, useState, useEffect, useContext } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const fetchCartCount = async () => {
    if (user) {
      try {
        const summary = await cartService.getCartSummary();
        setCartCount(summary.totalItems);
      } catch (error) {
        console.error('Failed to fetch cart count', error);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]);

  const refreshCart = () => {
    fetchCartCount();
  };

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
