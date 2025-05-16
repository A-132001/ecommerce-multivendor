import React from 'react';
import { Link } from 'react-router-dom';

export default function RelatedProducts({ currentProduct }) {
  const related = products.filter(
    p => p.store_id === currentProduct.store_id && p.id !== currentProduct.id
  );

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Related Products</h3>
      {related.length === 0 ? (
        <p>No related products found.</p>
      ) : (
        <ul>
          {related.map(p => (
            <li key={p.id}>
              <Link to={`/product/${p.id}`}>{p.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
