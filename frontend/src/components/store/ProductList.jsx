import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

export default function ProductList({ storeId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    
    if (!token) {
      setError('No authentication token found.');
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8000/api/products/?store_id=${storeId}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        const errorMessage = error.response
          ? error.response.data.detail || error.response.data.message || 'An error occurred.'
          : 'Error fetching products. Please try again later.';
        
        console.error('Error fetching products:', errorMessage);
        setError(errorMessage);
        setLoading(false);
      });
  }, [storeId]);

  if (loading) return <p>Loading products...</p>;

  if (error) return <p>{error}</p>;

  if (products.length === 0) return <p>No products available for this store.</p>;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
