import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import api from '../api/axios';
import api  from '../api/api';

const initialState = {
  cart: null,





  
  cartCount: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await api.get('/api/cart/my_cart/');
  return response.data;
});

export const addToCart = createAsyncThunk('cart/addToCart', 
  async ({ productId, quantity }) => {
    await api.post('/api/cart/add_item/', { product: productId, quantity });
    const response = await api.get('/api/cart/my_cart/');
    return response.data;
  }
);

export const updateQuantity = createAsyncThunk('cart/updateQuantity',
  async ({ productId, newQuantity }, { dispatch }) => {
    try {
      dispatch(tempUpdate({ productId, newQuantity }));
      await api.patch(`/api/cart/update_item/${productId}/`, { quantity: newQuantity });
      const response = await api.get('/api/cart/my_cart/');
      return response.data;
    } catch (error) {
      dispatch(rollbackUpdate());
      throw error;
    }
  }
);

export const removeFromCart = createAsyncThunk('cart/removeFromCart',
  async (productId) => {
    await api.delete(`/api/cart/remove_item/${productId}/`);
    const response = await api.get('/api/cart/my_cart/');
    return response.data;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    tempUpdate: (state, action) => {
      const { productId, newQuantity } = action.payload;
      state.cart.items = state.cart.items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      );
      state.cart.total_quantity = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      state.cart.total_price = state.cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    },
    rollbackUpdate: (state) => {
      state.cart = null;
      state.cartCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.cartCount = action.payload?.total_quantity || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        state.cartCount = action.payload.total_quantity;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.cartCount = action.payload.total_quantity;
      });
  }
});

export const { tempUpdate, rollbackUpdate } = cartSlice.actions;
export default cartSlice.reducer;