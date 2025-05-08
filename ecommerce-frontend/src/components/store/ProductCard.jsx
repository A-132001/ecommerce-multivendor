import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative">
        <img 
          src={product.image || 'https://via.placeholder.com/300'} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount && (
          <div className="absolute top-2 right-2 bg-secondary text-white px-2 py-1 rounded-md text-sm">
            {product.discount}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mt-3">
          <div>
            {product.originalPrice && (
              <span className="text-gray-400 line-through mr-2">${product.originalPrice}</span>
            )}
            <span className="text-primary font-bold">${product.price}</span>
          </div>
          
          <button className="bg-primary text-white p-2 rounded-full hover:bg-blue-700 transition">
            <span className="material-icons">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;