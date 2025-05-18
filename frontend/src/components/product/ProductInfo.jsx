import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Button, Badge, Stack } from 'react-bootstrap';
import { FaHeart, FaShoppingCart, FaEye, FaStar } from 'react-icons/fa';


export default function ProductInfo({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.info(
      !isFavorite 
        ? `${product.name} added to favorites!` 
        : `${product.name} removed from favorites!`,
      {
        position: "top-right",
        autoClose: 1500,
      }
    );
  };

  // Calculate discount percentage if original_price is available
  const showDiscountBadge = product.original_price && parseFloat(product.original_price) > 0;
  const discountPercentage = showDiscountBadge 
    ? Math.round((1 - parseFloat(product.price) / parseFloat(product.original_price)) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ marginBottom: '30px' , width: "50%"}}
      className='mx-auto my-5'
    >
      <Card className="h-100 shadow-sm">
        <div style={{ position: 'relative' }}>
          {product.image ? (
            <motion.div
              animate={isHovered ? { scale: 1.0005 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card.Img
                variant="top"
                src={product.image}
                alt={`${product.name}`}
                style={{ 
                  width: "100%", 
                  height: "300px", 
                  objectFit: 'contain',
                  padding: '10px',
                  backgroundColor: '#f8f9fa'
                }}
              />
            </motion.div>
          ) : (
            <div className="d-flex align-items-center justify-content-center bg-light" 
                 style={{ height: '300px' }}>
              <span className="text-muted">No Image Available</span>
            </div>
          )}
          
          <Button 
            variant="link" 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1,
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.8)'
            }}
            onClick={toggleFavorite}
          >
            <FaHeart 
              size={20} 
              color={isFavorite ? '#ff4d4d' : '#cccccc'} 
            />
          </Button>
          
          {showDiscountBadge && (
            <Badge 
              bg="danger"
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                fontSize: '0.9rem'
              }}
            >
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        <Card.Body className="d-flex flex-column">
          <Stack direction="horizontal" className="justify-content-between mb-2">
            <Card.Title className="mb-0">{product.name}</Card.Title>
            <Badge bg="secondary">{product.category}</Badge>
          </Stack>
          
          <Card.Text className="line-clamp-2 text-muted mb-3">
            {product.description}
          </Card.Text>
          
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="mb-0 text-yellow-600">
                  ${product.price}
                  {showDiscountBadge && (
                    <small className="text-muted text-decoration-line-through ms-2">
                      ${product.original_price}
                    </small>
                  )}
                </h5>
              </div>
              
              {product.stock > 0 ? (
                <Badge bg="success">In Stock: {product.stock}</Badge>
              ) : (
                <Badge bg="danger">Out of Stock</Badge>
              )}
            </div>
            
            <div className="d-flex">

              <Button 
                variant="yellow-600" 
                size="sm"
                // className="d-flex align-items-center flex-grow-1 justify-content-center"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <FaShoppingCart className="me-1" /> Add to Cart
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}