import React from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../components/store/ProductList';

export default function StorePage() {
  const { store_id } = useParams();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Store #{store_id}</h1>
      <p>Store description and info can go here...</p>

      <h2 style={{ marginTop: '30px' }}>Products</h2>
      <ProductList storeId={store_id} />
    </div>
  );
}
