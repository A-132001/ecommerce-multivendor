import { useEffect, useState } from 'react';
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
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const CartPage = () => {
  const currency = useSelector((state) => state.currency.value);
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (cart && Array.isArray(cart.items)) {
      const initialQuantities = {};
      cart.items.forEach(item => {
        initialQuantities[item.product.id] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value);
    if (numValue > 0) {
      setQuantities(prev => ({ ...prev, [productId]: numValue }));
    }
  };

  const handleUpdateQuantity = async (productId) => {
    try {
      await updateQuantity(productId, quantities[productId]);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  if (!cart) {
    return (
      <Container>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button component={Link} to="/products" variant="contained">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
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
            {Array.isArray(cart.items) && cart.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: 50, height: 50, marginRight: 16 }}
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
                      onBlur={() => handleUpdateQuantity(item.product.id)}
                      inputProps={{ min: 1 }}
                      sx={{ width: 80 }}
                      disabled={loading}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${Number(item.total_price || 0).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => removeFromCart(item.product.id)}
                    disabled={loading}
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
              <Typography>${Number(cart.total_price || 0).toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Shipping</Typography>
              <Typography>Free</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="subtitle1">Total</Typography>
              <Typography variant="subtitle1">
                ${Number(cart.total_price || 0).toFixed(2)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              component={Link}
              to="/checkout"
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
