// src/components/ProductCard.jsx
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    IconButton,
  } from '@mui/material';
  import { useCart } from '../context/CartContext';
  import { useState } from 'react';
  import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
  
  const ProductCard = ({ product }) => {
    const { addToCart, loading } = useCart();
    const [isAdding, setIsAdding] = useState(false);
  
    const handleAddToCart = async () => {
      setIsAdding(true);
      try {
        await addToCart(product.id);
      } finally {
        setIsAdding(false);
      }
    };
  
    return (
      <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="140"
          image={product.image}
          alt={product.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            ${product.price.toFixed(2)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            View Details
          </Button>
          <IconButton
            color="primary"
            aria-label="add to cart"
            onClick={handleAddToCart}
            disabled={loading || isAdding}
          >
            <AddShoppingCartIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  };
  
  export default ProductCard;