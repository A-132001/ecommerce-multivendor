// src/components/ProductCard.jsx
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { FaCartPlus, FaCheck } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  const [isAdded, setisAdded] = useState(false);

  const handleAddToCart = async () => {
    setisAdded(true);
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setisAdded(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          variant={isAdded ? "success" : "primary"}
          aria-label={isAdded ? "Item added to cart" : "Add to cart"}
          onClick={handleAddToCart}
          disabled={isLoading}
          className="position-relative"
          style={{
            transition: "all 0.3s ease",
            width: "40px",
            height: "40px",
          }}
        >
          {isLoading ? (
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : isAdded ? (
            <FaCheck size={16} />
          ) : (
            <FaCartPlus size={16} />
          )}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
