import React, { useState, useEffect, useCallback } from 'react';
import { FaShoppingCart, FaStar, FaHeart, FaCartPlus, FaCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';

const StockBadge = React.memo(({ stock }) => {
  return (
    <span className={`px-2 py-1 rounded-pill text-white small fw-semibold 
        ${stock > 15 ? 'bg-success' : stock > 5 ? 'bg-warning' : 'bg-danger'}`}>
      {stock} left
    </span>
  );
});

const RatingBadge = React.memo(({ rating }) => {
  return (
    <span className={`px-2 py-1 rounded-pill text-white small fw-semibold 
        ${rating >= 4.5 ? 'bg-success' : rating >= 3.5 ? 'bg-warning' : 'bg-danger'}`}>
      <FaStar className="me-1" />
      {rating}
    </span>
  );
});

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const currency = useSelector((state) => state.currency.value);
  const { addToCart, loading,cart } = useCart();

  

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setIsFavorite(favorites.some(fav => fav.id === product.id));
  }, [product.id]);

  const toggleFavorite = useCallback(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = isFavorite
      ? favorites.filter(fav => fav.id !== product.id)
      : [...favorites, product];
    
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    showFavoriteAlert(!isFavorite);
  }, [isFavorite, product]);

  const showFavoriteAlert = useCallback((added) => {
    Swal.fire({
      title: added ? 'Added to Favorites!' : 'Removed from Favorites',
      text: added
        ? `${product.name} has been added to your favorites`
        : `${product.name} has been removed from favorites`,
      icon: 'success',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#d4a017',
      timer: 1500,
      showConfirmButton: false,
      customClass: {
        popup: 'shadow-lg border border-gray-700'
      }
    });
  }, [product.name]);

  const handleAddToCart = useCallback(async () => {
    try {
      setIsAddedToCart(true);
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart`, {
        position: "top-right",
      });
    } catch (error) {
      setIsAddedToCart(false);
      toast.error('Could not add to cart.', {
        position: "top-right",
      });
    }
  }, [addToCart, product.id, product.name]);


useEffect(() => {
  if (cart) {
    const isProductInCart = cart.items.some(item => item.product.id === product.id);
    setIsAddedToCart(isProductInCart);
  }
}, [cart, product.id]);


  return (
    <div className="col">
      <div
        id={product.id}
        className={`position-relative rounded-lg shadow-sm overflow-hidden 
                text-secondary bg-white h-100 d-flex flex-column`}
        style={{ width: '100%' }}
      >
         <div className="position-relative">
          <img
            src={product.image || 'https://img.freepik.com/free-vector/blue-studio-background_1017-2241.jpg?t=st=1746920445~exp=1746924045~hmac=a7387cbb298600a947eb0dd810169b97c9891a9026b93e6da5695893ac1c3fd2&w=740'}
            alt={product.name}
            className="rounded mx-2 mt-2 object-fit-cover"
            style={{ height: '24rem', width: '96% ' }}
          />

          {product.discount > 0 && (
            <div className="position-absolute top-0 end-0 bg-danger text-white px-3 py-1 rounded-1 small fw-bold shadow-sm">
              {product.discount}% OFF
            </div>
          )}

          {product.rating && (
            <div className="position-absolute bottom-0 start-0 m-2">
              <RatingBadge rating={product.rating} />
            </div>
          )}
        </div>

        <div className="w-100 rounded px-3 py-2 flex-grow-1">
          <div className="mb-2 d-flex align-items-start gap-2">
            {/* Product name with flex-shrink and min-width 0 to allow truncation */}
            <h6
              className="fw-bold text-dark text-truncate mb-0 flex-grow-1"
              style={{ minWidth: 0 }}
              title={product.name}  // Show full name on hover
            >
              {product.name}
            </h6>

            {/* Stock badge with fixed width */}
            <div className="flex-shrink-0">
              <StockBadge stock={product.stock} />
            </div>
          </div>

          {/* Description with line clamping */}
          <p
            className="text-muted mb-0 line-clamp-2"
            style={{
              WebkitLineClamp: 2,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            title={product.description}  
          >
            {product.description}
          </p>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto px-3 mb-2">
          <div className="d-flex align-items-center gap-2">
            {product.original_price > 0 && (
              <span className="text-decoration-line-through text-muted small">${product.original_price}</span>
            )}
            <span className="text-danger fw-bold fs-5">{currency} {product.price}</span>
          </div>
        </div>
        <div className="d-flex align-items-center px-3 pb-3">
          <Link
            to={`/product/${product.id}`}
            state={{ product }}
            className="btn btn-outline-dark text-center shadow-sm flex-grow-1 me-2"
          >
            View Details 
          </Link>
          <button
            className="btn btn-outline-dark shadow-sm px-3"
           
            // disabled={loading}
          >
            {isAddedToCart ? <FaCheck color="green" /> : <FaCartPlus color="green"  onClick={handleAddToCart} />}
          </button>
          <button
            className="btn shadow-sm px-3 ms-2"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite();
            }}
          >
            <FaHeart color={isFavorite ? '#ff4d4d' : 'gray'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);