import React from 'react';


const ProductManagementTable = () => {
  return (
    <div>
      <h1>Product Management</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Description</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Price</th>
            <th style={{ border: '1px solid #ccc', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.id}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.name}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.description}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>{product.price}</td>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                <button style={{ marginRight: '8px' }}>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagementTable;