import React from 'react';

export default function AddToCart({ product }) {
  const handleAdd = () => {
    console.log("Added to cart:", product.name);
  };

  return (
    <button onClick={handleAdd}>Add to Cart</button>
  );
}
