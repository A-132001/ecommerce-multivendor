import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';



const AddProductForm = ({ addProduct }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: null,
      discount: 0,
      is_active: true
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    response = await addProduct(data);
    console.log(response);
    reset();
    if (response.status === 201) {
      reset();
    }
  };

  const imagePreview = watch('image');




  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card shadow-lg p-4"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="mb-4 text-primary">Add Product</h3>

        <div className="mb-3">
          <label htmlFor="productName" className="form-label">Product Name*</label>
          <input
            type="text"
            className={`form-control ${errors.name && 'is-invalid'}`}
            id="productName"
            placeholder="Enter product name"
            {...register('name', { required: 'Product name is required' })}
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="productDescription" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="productDescription"
            placeholder="Enter product description"
            {...register('description')}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="productPrice" className="form-label">Price*</label>
            <input
              type="number"
              className={`form-control ${errors.price && 'is-invalid'}`}
              id="productPrice"
              placeholder="Enter product price"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
            />
            {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="productStock" className="form-label">Stock*</label>
            <input
              type="number"
              className={`form-control ${errors.stock && 'is-invalid'}`}
              id="productStock"
              placeholder="Enter product stock"
              {...register('stock', {
                required: 'Stock is required',
                min: { value: 0, message: 'Stock must be positive' }
              })}
            />
            {errors.stock && <div className="invalid-feedback">{errors.stock.message}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="productCategory" className="form-label">Category*</label>
          <input
            type="text"
            className={`form-control ${errors.category && 'is-invalid'}`}
            id="productCategory"
            placeholder="Enter product category"
            {...register('category', { required: 'Category is required' })}
          />
          {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="productDiscount" className="form-label">Discount (%)</label>
          <input
            type="number"
            className="form-control"
            id="productDiscount"
            placeholder="Enter discount percentage"
            min="0"
            max="100"
            {...register('discount')}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productImage" className="form-label">Product Image</label>
          <input
            type="file"
            className="form-control"
            id="productImage"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="img-thumbnail"
                style={{ maxHeight: '200px' }}
              />
            </div>
          )}
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="isActive"
            {...register('is_active')}
          />
          <label className="form-check-label" htmlFor="isActive">
            Active Product
          </label>
        </div>

        <motion.button
          type="submit"
          className="btn btn-primary w-100 py-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add Product
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddProductForm;