import React, { useState } from 'react';

const AddProductForm = ({ addProduct }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock || !form.category) {
      alert('Please fill in all required fields.');
      return;
    }

    addProduct(form);

    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: null,
    });

    alert('Product added successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Product</h3>
      <div className="mb-3">
        <label htmlFor="productName" className="form-label">Product Name</label>
        <input
          type="text"
          className="form-control"
          id="productName"
          placeholder="Enter product name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="productDescription" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="productDescription"
          placeholder="Enter product description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="productPrice" className="form-label">Price</label>
        <input
          type="number"
          className="form-control"
          id="productPrice"
          placeholder="Enter product price"
          name="price"
          value={form.price}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="productStock" className="form-label">Stock</label>
        <input
          type="number"
          className="form-control"
          id="productStock"
          placeholder="Enter product stock"
          name="stock"
          value={form.stock}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="productCategory" className="form-label">Category</label>
        <input
          type="text"
          className="form-control"
          id="productCategory"
          placeholder="Enter product category"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="productImage" className="form-label">Image</label>
        <input
          type="file"
          className="form-control"
          id="productImage"
          onChange={handleImageChange}
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Product</button>
    </form>
  );
};

export default AddProductForm;
