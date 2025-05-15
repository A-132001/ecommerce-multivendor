// src/components/CartIcon.jsx
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <IconButton
      component={Link}
      to="/cart"
      size="large"
      color="inherit"
      aria-label="shopping cart"
    >
      <Badge badgeContent={cartCount} color="error">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartIcon;