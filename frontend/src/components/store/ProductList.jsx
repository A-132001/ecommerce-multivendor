import React from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

export default function ProductList() {
  

  return (
    <div className="product-list">
      {dummyProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
