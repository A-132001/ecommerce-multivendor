import React from 'react';
import { FaShoppingCart, FaStar, FaHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const StockBadge = ({ stock }) => {
  return (
    <span className={`px-2 py-1 rounded-pill text-white small fw-semibold 
        ${stock > 15 ? 'bg-success' : stock > 5 ? 'bg-warning' : 'bg-danger'}`}>
      {stock} left
    </span>
  );
};

const RatingBadge = ({ rating }) => {
  return (
    <span className={`px-2 py-1 rounded-pill text-white small fw-semibold 
        ${rating >= 4.5 ? 'bg-success' : rating >= 3.5 ? 'bg-warning' : 'bg-danger'}`}>
      <FaStar className="me-1" />
      {rating}
    </span>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1); // Add 1 quantity
      Swal.fire({
        title: 'Added to Cart',
        text: `${product.name} has been added to your cart`,
        icon: 'success',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#d4a017',
        customClass: {
          popup: 'shadow-lg border border-gray-700'
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Could not add to cart.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#d4a017',
      });
    }
  };

  return (
    <div className="col">
    <div 
      id={product.id} 
      className="position-relative rounded-lg shadow-sm overflow-hidden 
                text-secondary bg-white h-100 d-flex flex-column"
                style={{ width: '100%' }}
    >
      <div className="position-relative">
        <img 
          src={product.image || 'https://img.freepik.com/free-vector/blue-studio-background_1017-2241.jpg?t=st=1746920445~exp=1746924045~hmac=a7387cbb298600a947eb0dd810169b97c9891a9026b93e6da5695893ac1c3fd2&w=740'} 
          alt={product.name}
          className="rounded mx-2 mt-2 object-fit-cover" 
          style={{ height: '24rem' , width: '96% '}}
        />
        
        {product.discount && (
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
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <h6 className="fw-bold text-base text-dark text-truncate">{product.name}</h6>
          <StockBadge stock={product.stock} />
        </div>
        
        <p className="text-muted mb-2 line-clamp-2" style={{ WebkitLineClamp: 2 }}>
          {product.description}
        </p>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-auto px-3 mb-2">
        <div className="d-flex align-items-center gap-2">
          {product.original_price && (
            <span className="text-decoration-line-through text-muted small">${product.original_price}</span>
          )}
          <span className="text-danger fw-bold fs-5">${product.price}</span>
        </div>
      </div>

      <div className="d-flex align-items-center px-3 pb-3">
        <Link 
          to={`/product/${product.id}`}
          className="btn btn-outline-dark text-center shadow-sm flex-grow-1 me-2"
        >
          View Details
        </Link>
        <button 
          className="btn btn-outline-dark shadow-sm px-3"
          onClick={handleAddToCart}
          disabled={loading}
        >
          <FaShoppingCart />
        </button>
        <button 
          className="btn btn-outline-danger shadow-sm px-3 ms-2"
          onClick={(e) => {
            e.preventDefault();
            // handleAddToWishlist(product);
          }}
        >
          <FaHeart />
        </button>
      </div>

      {product.stock === 0 && (
        <div className="position-absolute top-50 start-50 translate-middle bg-dark text-white p-2 rounded">
          Out of Stock
        </div>
      )}
    </div>
    </div>
  );
};

export default ProductCard;