import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, authTokens } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setCartCount(0);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/api/cart/my_cart/');
      setCart(response.data);
      setCartCount(response.data.total_quantity || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      await api.post('/api/cart/add_item/', { product: productId, quantity });
      await fetchCart(); 
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const prevCart = { ...cart };
      const updatedItems = cart.items.map(item => 
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
      setCart({ ...cart, items: updatedItems });

      await api.patch(
        `/api/cart/update_item/${productId}/`,
        { quantity: newQuantity },
      );
      
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      setCart(prevCart);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await api.delete(`/api/cart/remove_item/${productId}/`);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);