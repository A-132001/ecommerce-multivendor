import React, { useState } from 'react';

const ProductManagementTable = ({ products, onDelete, onEdit }) => {
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(editingProductId, editForm);
    setEditingProductId(null);
    setEditForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
    });
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Product Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Category</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>
              {editingProductId === product.id ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="form-control"
                />
              ) : (
                product.name
              )}
            </td>
            <td>
              {editingProductId === product.id ? (
                <input
                  type="text"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="form-control"
                />
              ) : (
                product.description
              )}
            </td>
            <td>
              {editingProductId === product.id ? (
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditChange}
                  className="form-control"
                />
              ) : (
                product.price
              )}
            </td>
            <td>
              {editingProductId === product.id ? (
                <input
                  type="number"
                  name="stock"
                  value={editForm.stock}
                  onChange={handleEditChange}
                  className="form-control"
                />
              ) : (
                product.stock
              )}
            </td>
            <td>
              {editingProductId === product.id ? (
                <input
                  type="text"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="form-control"
                />
              ) : (
                product.category
              )}
            </td>
            <td>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              ) : (
                'No Image'
              )}
            </td>
            <td>
              {editingProductId === product.id ? (
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={handleEditSubmit}
                >
                  Save
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
              )}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductManagementTable;
