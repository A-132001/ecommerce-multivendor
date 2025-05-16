import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, Button, Modal, Badge, Spinner, Alert } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiSave, FiX, FiImage, FiPlus, FiUpload } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// import { getAllCategories } from '../../api/api.js';
import { toast } from "react-toastify";

const MySwal = withReactContent(Swal);

const ProductManagementTable = ({ products, onDelete, onEdit, onAdd }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
    setValue: setEditValue
  } = useForm();

  const {
    register: registerAdd,
    handleSubmit: handleAddSubmit,
    reset: resetAdd,
    formState: { errors: addErrors }
  } = useForm();

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setEditValue('name', product.name);
    setEditValue('description', product.description);
    setEditValue('price', product.price);
    setEditValue('stock', product.stock);
    setEditValue('category', product.category);
    setImagePreview(product.image || null);
    setShowEditModal(true);
  };

  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setUploadError('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size should be less than 10MB');
      return;
    }

    setUploadError(null);
    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const onAddSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }
      const response = await onAdd(formData);
      setShowAddModal(false);
      resetAdd();
      setImagePreview(null);
      setSelectedImageFile(null)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const onEditSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'imageFile') {
          formData.append(key, value);
        }
      });
      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }

    
      await onEdit(currentProduct.id, formData);

     
      setShowEditModal(false);
      resetEdit();
      setImagePreview(null);
      setSelectedImageFile(null);
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Failed to update product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
        MySwal.fire('Deleted!', 'The product has been deleted.', 'success');
      }
    });
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    resetEdit();
    resetAdd();
    setImagePreview(null);
    setUploadError(null);
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          "Something went wrong while fetching categories.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    // fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Product Management</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)} className="d-flex align-items-center">
          <FiPlus className="me-2" /> Add Product
        </Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedProducts.map((product) => (
                <motion.tr
                  key={product.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <td><strong>{product.name}</strong></td>
                  <td><span className="text-muted">{product.description || '-'}</span></td>
                  <td><Badge bg="success">${parseFloat(product.price).toFixed(2)}</Badge></td>
                  <td><Badge bg={product.stock > 0 ? 'info' : 'danger'}>{product.stock} in stock</Badge></td>
                  <td><Badge bg="secondary">{product.category}</Badge></td>
                  <td>
                    {product.image ? (
                      <motion.img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => window.open(product.image, '_blank')}
                      />
                    ) : (
                      <div className="text-center text-muted">
                        <FiImage size={24} />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="warning" size="sm" onClick={() => handleEditClick(product)} className="d-flex align-items-center">
                        <FiEdit className="me-1" /> Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => confirmDelete(product.id)} className="d-flex align-items-center">
                        <FiTrash2 className="me-1" /> Delete
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </Table>
      </div>
{/* Edit Product Modal */}
<Modal show={showEditModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit(onEditSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className={`form-control ${editErrors.name ? 'is-invalid' : ''}`}
                    {...registerEdit('name', { required: 'Product name is required' })}
                  />
                  {editErrors.name && (
                    <div className="invalid-feedback">{editErrors.name.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    {...registerEdit('description')}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${editErrors.price ? 'is-invalid' : ''}`}
                    {...registerEdit('price', {
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                  />
                  {editErrors.price && (
                    <div className="invalid-feedback">{editErrors.price.message}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className={`form-control ${editErrors.stock ? 'is-invalid' : ''}`}
                    {...registerEdit('stock', {
                      required: 'Stock is required',
                      min: { value: 0, message: 'Stock must be positive' }
                    })}
                  />
                  {editErrors.stock && (
                    <div className="invalid-feedback">{editErrors.stock.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    {...registerEdit('category')}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="d-none"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={triggerFileInput}
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <FiUpload className="me-2" /> Upload Image
                  </Button>
                  {uploading && (
                    <div className="mt-2 text-center">
                      <Spinner animation="border" size="sm" /> Uploading...
                    </div>
                  )}
                  {uploadError && (
                    <Alert variant="danger" className="mt-2 py-1">
                      {uploadError}
                    </Alert>
                  )}
                </div>

                {imagePreview && (
                  <div className="text-center mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '4px'
                      }}
                    />
                    <div className="mt-1 text-muted small">Image Preview</div>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button
                variant="outline-secondary"
                onClick={handleModalClose}
                disabled={loading}
                aria-disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-live="polite"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    <span>Saving...</span>
                  </>
                ) : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      
      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddSubmit(onAddSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className={`form-control ${addErrors.name ? 'is-invalid' : ''}`}
                    {...registerAdd('name', { required: 'Product name is required' })}
                  />
                  {addErrors.name && (
                    <div className="invalid-feedback">{addErrors.name.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    className="form-control"
                    {...registerAdd('description')}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${addErrors.price ? 'is-invalid' : ''}`}
                    {...registerAdd('price', {
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                  />
                  {addErrors.price && (
                    <div className="invalid-feedback">{addErrors.price.message}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    min="0"
                    className={`form-control ${addErrors.stock ? 'is-invalid' : ''}`}
                    {...registerAdd('stock', {
                      required: 'Stock is required',
                      min: { value: 0, message: 'Stock must be positive' }
                    })}
                  />
                  {addErrors.stock && (
                    <div className="invalid-feedback">{addErrors.stock.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    {...registerAdd('category')}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a category</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="mb-3">
                  <label className="form-label">Product Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="d-none"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={triggerFileInput}
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <FiUpload className="me-2" /> Upload Image
                  </Button>
                  {uploading && (
                    <div className="mt-2 text-center">
                      <Spinner animation="border" size="sm" /> Uploading...
                    </div>
                  )}
                  {uploadError && (
                    <Alert variant="danger" className="mt-2 py-1">
                      {uploadError}
                    </Alert>
                  )}
                </div>

                {imagePreview && (
                  <div className="text-center mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '4px'
                      }}
                    />
                    <div className="mt-1 text-muted small">Image Preview</div>
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button
                variant="outline-secondary"
                onClick={handleModalClose}
                disabled={loading}
                aria-disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-live="polite"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    <span>Adding...</span>
                  </>
                ) : "Add Product"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    
      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button
          variant="outline-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          variant="outline-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>

     

    </div>
  );
};

export default ProductManagementTable;
