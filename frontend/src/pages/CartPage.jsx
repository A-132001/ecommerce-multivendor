import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CartPage = () => {
  const currency = useSelector((state) => state.currency.value);
  const { cart, updateQuantity, removeFromCart, resetCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [debounceTimers, setDebounceTimers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (cart?.items) {
      const initialQuantities = {};
      cart.items.forEach(item => {
        initialQuantities[item.product.id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  const cartItems = useMemo(() => {
    return cart?.items || [];
  }, [cart?.items]);

  const handleQuantityChange = useCallback((productId, value) => {
    const numValue = parseInt(value);
    if (numValue > 0) {
      setQuantities(prev => ({ ...prev, [productId]: numValue }));
      
      if (debounceTimers[productId]) {
        clearTimeout(debounceTimers[productId]);
      }

      const timer = setTimeout(async () => {
        try {
          await updateQuantity(productId, numValue);
        } catch (error) {
          console.error('Failed to update quantity:', error);
        }
      }, 300);

      setDebounceTimers(prev => ({ ...prev, [productId]: timer }));
    }
  }, [debounceTimers, updateQuantity]);

  useEffect(() => {
    return () => {
      Object.values(debounceTimers).forEach(timer => clearTimeout(timer));
    };
  }, [debounceTimers]);

  const handleRemoveItem = useCallback(async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }, [removeFromCart]);

  const handleResetCart = useCallback(async () => {
    try {
      await resetCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  }, [resetCart]);

  if (!cart || cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          p: 3
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Looks like you haven't added any items to your cart yet.
        </Typography>
        <Button
          component={Link}
          to="/list-stores"
          variant="contained"
          size="large"
          sx={{ 
            borderRadius: 5,
            backgroundColor: '#d4a017',
            color: '#fff',
            fontWeight: '600',
            '&:hover': {
              backgroundColor: '#ede4cd',
              color: '#fff', 
            },
          }}
        >
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={`${item.id}-${item.quantity}`}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: 50, height: 50, marginRight: 16, borderRadius: 4 }}
                      />
                      <Typography>{item.product.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {currency} {Number(item.product.price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <TextField
                        type="number"
                        size="small"
                        value={quantities[item.product.id] || 1}
                        onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                        inputProps={{ min: 1 }}
                        sx={{ width: 80 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {currency} {Number(item.total_price || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleRemoveItem(item.product.id)}
                      aria-label={`Remove ${item.product.name} from cart`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container justifyContent="flex-end" sx={{ mt: 3 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography>Subtotal</Typography>
                <Typography>{currency} {cart.total_price?.toFixed(2)}</Typography>
              </Box>
              <Button
                variant="contained"
                sx={{ 
                  backgroundColor: '#d4a017',
                  color: '#2d2d2d',
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#b8860b',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                  mb: 2
                }}
                fullWidth
                component={Link}
                to="/orders"
              >
                Place Order
              </Button>
              <Button
                variant="outlined"
                sx={{ 
                  border: '2px solid #2d2d2d',
                  color: '#2d2d2d',
                  fontWeight: 500,
                  py: 1.5,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#2d2d2d',
                    backgroundColor: 'rgba(212, 160, 23, 0.12)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  },
                }}
                fullWidth
                onClick={handleResetCart}
              >
                Reset Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default React.memo(CartPage);