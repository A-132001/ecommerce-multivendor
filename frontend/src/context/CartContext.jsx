import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, authTokens } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      setCartCount(0);
      return;
    }
    try {
      const response = await api.get('/api/cart/my_cart/');
      setCart(response.data);
      setCartCount(response.data.total_quantity || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const optimisticCart = cart ? {...cart} : { items: [], total_price: 0, total_quantity: 0 };
      const existingItem = optimisticCart.items.find(item => item.product.id === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        optimisticCart.items.push({
          id: Date.now(),
          product: { id: productId },
          quantity,
          total_price: 0
        });
      }
      
      optimisticCart.total_quantity += quantity;
      setCart(optimisticCart);
      setCartCount(prev => prev + quantity);

      await api.post('/api/cart/add_item/', { product: productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      fetchCart();
      throw error;
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const updatedItems = cart.items.map(item => 
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
      
      const newTotalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      
      setCart(prev => ({
        ...prev,
        items: updatedItems,
        total_quantity: newTotalQuantity
      }));
      setCartCount(newTotalQuantity);

      await api.patch(`/api/cart/update_item/${productId}/`, { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
      fetchCart();
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const itemToRemove = cart.items.find(item => item.product.id === productId);
      if (itemToRemove) {
        const newTotalQuantity = cart.total_quantity - itemToRemove.quantity;
        setCart({
          ...cart,
          items: cart.items.filter(item => item.product.id !== productId),
          total_quantity: newTotalQuantity
        });
        setCartCount(newTotalQuantity);
      }

      await api.delete(`/api/cart/remove_item/${productId}/`);
    } catch (error) {
      console.error('Error removing from cart:', error);
      fetchCart();
      throw error;
    }
  };

  const resetCart = useCallback(async () => {
    try {
      setCart(null);
      setCartCount(0);
      await api.delete('/api/cart/clear/');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      fetchCart();
      throw error;
    }
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        resetCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);