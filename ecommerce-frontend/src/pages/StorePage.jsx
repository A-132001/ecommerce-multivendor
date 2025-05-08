import React from 'react';
import { useParams } from 'react-router-dom';
import { stores, products } from '../data/TestData';

export default function StorePage() {
  const { store_id } = useParams();
  const store = stores.find(s => s.id === Number(store_id));
  const storeProducts = products.filter(p => p.store_id === Number(store_id));

  if (!store) return <p>Store not found</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{store.name}</h1>
      <p>{store.description}</p>

      <h2>Products</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {storeProducts.map(product => (
          <div key={product.id} style={{
            border: '1px solid #ccc',
            padding: '15px',
            width: '200px',
            borderRadius: '8px'
          }}>
            <h4>{product.name}</h4>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
