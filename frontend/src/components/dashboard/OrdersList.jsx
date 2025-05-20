import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table, Button, Modal, Badge, Spinner, Alert } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiSave, FiX, FiShoppingCart, FiCheckCircle, FiTruck, FiPlus } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const statusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger'
};

const OrdersList = ({ orders = [], onDelete, onEdit, onAdd }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  const [error, setError] = useState(null);

  // React Hook Form setup
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

  const handleEditClick = (order) => {
    setCurrentOrder(order);
    setEditValue('status', order.status);
    setEditValue('total', order.total);
    setEditValue('customerName', order.customerName);
    setEditValue('orderDate', order.orderDate);
    setEditValue('shippingAddress', order.shippingAddress);
    setShowEditModal(true);
  };

  const onEditSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      await onEdit(currentOrder.id, data);
      setShowEditModal(false);
      resetEdit();
    } catch (err) {
      setError(err.message || 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const onAddSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      await onAdd(data);
      setShowAddModal(false);
      resetAdd();
    } catch (err) {
      setError(err.message || 'Failed to create order');
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
        MySwal.fire(
          'Deleted!',
          'The order has been deleted.',
          'success'
        );
      }
    });
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setShowAddModal(false);
    resetEdit();
    resetAdd();
    setError(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiShoppingCart className="me-1" />;
      case 'processing':
        return <FiCheckCircle className="me-1" />;
      case 'shipped':
        return <FiTruck className="me-1" />;
      case 'delivered':
        return <FiCheckCircle className="me-1" />;
      default:
        return <FiShoppingCart className="me-1" />;
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);


  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Orders Management</h2>
       
      </div>

      <div className="table-responsive">
        <Table striped bordered hover className="shadow-sm">
          <thead className="table-dark">
            <tr>
            
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Shipping Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {currentOrders.map((order) => (
                <motion.tr
                  key={order.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                 
                  <td><strong>{order.customerName}</strong></td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={statusColors[order.status] || 'secondary'} className="d-flex align-items-center">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg="success">${parseFloat(order.total).toFixed(2)}</Badge>
                  </td>
                  <td>
                    <small className="text-muted">{order.shippingAddress}</small>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="warning" 
                        size="sm" 
                        onClick={() => handleEditClick(order)}
                        className="d-flex align-items-center"
                      >
                        <FiEdit className="me-1" /> Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        onClick={() => confirmDelete(order.id)}
                        className="d-flex align-items-center"
                      >
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

      {/* Edit Order Modal */}
      <Modal show={showEditModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Order #{currentOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditSubmit(onEditSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className={`form-control ${editErrors.customerName ? 'is-invalid' : ''}`}
                    {...registerEdit('customerName', { required: 'Customer name is required' })}
                  />
                  {editErrors.customerName && (
                    <div className="invalid-feedback">{editErrors.customerName.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Order Date</label>
                  <input
                    type="date"
                    className={`form-control ${editErrors.orderDate ? 'is-invalid' : ''}`}
                    {...registerEdit('orderDate', { required: 'Order date is required' })}
                  />
                  {editErrors.orderDate && (
                    <div className="invalid-feedback">{editErrors.orderDate.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${editErrors.total ? 'is-invalid' : ''}`}
                    {...registerEdit('total', { 
                      required: 'Total amount is required',
                      min: { value: 0, message: 'Total must be positive' }
                    })}
                  />
                  {editErrors.total && (
                    <div className="invalid-feedback">{editErrors.total.message}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className={`form-select ${editErrors.status ? 'is-invalid' : ''}`}
                    {...registerEdit('status', { required: 'Status is required' })}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {editErrors.status && (
                    <div className="invalid-feedback">{editErrors.status.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Shipping Address</label>
                  <textarea
                    rows={3}
                    className={`form-control ${editErrors.shippingAddress ? 'is-invalid' : ''}`}
                    {...registerEdit('shippingAddress', { required: 'Shipping address is required' })}
                  />
                  {editErrors.shippingAddress && (
                    <div className="invalid-feedback">{editErrors.shippingAddress.message}</div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={handleModalClose} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Add Order Modal */}
      <Modal show={showAddModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddSubmit(onAddSubmit)}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className={`form-control ${addErrors.customerName ? 'is-invalid' : ''}`}
                    {...registerAdd('customerName', { required: 'Customer name is required' })}
                  />
                  {addErrors.customerName && (
                    <div className="invalid-feedback">{addErrors.customerName.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Order Date</label>
                  <input
                    type="date"
                    className={`form-control ${addErrors.orderDate ? 'is-invalid' : ''}`}
                    {...registerAdd('orderDate', { required: 'Order date is required' })}
                  />
                  {addErrors.orderDate && (
                    <div className="invalid-feedback">{addErrors.orderDate.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className={`form-control ${addErrors.total ? 'is-invalid' : ''}`}
                    {...registerAdd('total', { 
                      required: 'Total amount is required',
                      min: { value: 0, message: 'Total must be positive' }
                    })}
                  />
                  {addErrors.total && (
                    <div className="invalid-feedback">{addErrors.total.message}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className={`form-select ${addErrors.status ? 'is-invalid' : ''}`}
                    {...registerAdd('status', { required: 'Status is required' })}
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {addErrors.status && (
                    <div className="invalid-feedback">{addErrors.status.message}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Shipping Address</label>
                  <textarea
                    rows={3}
                    className={`form-control ${addErrors.shippingAddress ? 'is-invalid' : ''}`}
                    {...registerAdd('shippingAddress', { required: 'Shipping address is required' })}
                  />
                  {addErrors.shippingAddress && (
                    <div className="invalid-feedback">{addErrors.shippingAddress.message}</div>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button variant="secondary" onClick={handleModalClose} disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating...
                  </>
                ) : (
                  'Add Order'
                )}
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

export default OrdersList;