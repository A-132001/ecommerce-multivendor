import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Modal, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  FaStore, FaEdit, FaTrash, FaSave, FaTimes, FaPhone, FaEnvelope, FaImage, FaCalendarAlt, FaAddressCard,
  FaPowerOff, FaCheck, FaExclamationTriangle, FaSync, FaHome
} from 'react-icons/fa';
import { format } from "date-fns"
import { getStore, updateStore, deleteStore, toggleStoreActiveStatus } from '../../api/api';

const MySwal = withReactContent(Swal);

const StoreProfile = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await getStore();
        console.log(response.data)
        console.log(store)
        setStore(response.data);
        setLogoPreview(response.data.store_logo);
        reset(response.data);
      } catch (err) {
        console.error('Error loading store data:', err);
        if (err.response.status == 404) {
          setError("You do not have soter related to your account.")
          return;
        }
        const message =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.response?.data?.error ||
          err.message ||
          'Failed to load store data. Please try again later.';

        setError(message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [reset]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    reset(store);
    setLogoPreview(store.store_logo);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === 'store_logo' && value && value.length > 0) {
          formData.append('store_logo', value[0]);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      const response = await updateStore(store.id, formData);
      console.log(response)
      setStore(response.data);
      setEditing(false);
      MySwal.fire({
        title: 'Success!',
        text: 'Store profile updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (err) {
      console.error('Update Error:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Failed to update store profile';

      MySwal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
    finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteStore(store.id);

      await MySwal.fire({
        title: 'Deleted!',
        text: 'Store profile has been successfully deleted.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      window.location.navigate = '/'
    } catch (err) {
      console.error('Deletion Error:', err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        err.message ||
        'Failed to delete store profile. Please try again.';

      await MySwal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };


  const confirmDelete = () => {
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
        handleDelete();
      }
    });
  };

  if (loading && !store) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  if (error) return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column" style={{ zIndex: 1050 }}>
      <div
        className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center"
        style={{
          background: 'linear-gradient(135deg, #fff9f9 0%, #ffebeb 100%)'
        }}
      >
        <FaExclamationTriangle size={64} className="text-danger mb-4" />
        <h1 className="display-5 fw-bold mb-3">We Hit a Snag</h1>
        <p className="lead mb-5" style={{ maxWidth: '600px' }}>{error}</p>
        <div className="d-flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-lg btn-outline-danger"
          >
            <FaSync className="me-2" />
            Refresh Page
          </button>
          <button
            onClick={() => window.location = '/'}
            className="btn btn-lg btn-danger"
          >
            <FaHome className="me-2" />
            Home
          </button>
        </div>
      </div>
      <div className="bg-danger py-2 text-white text-center">
        <small>Error Code: {Date.now()}</small>
      </div>
    </div>
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container className="py-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        transition={{ duration: 0.5 }}
      >
        <Row className="justify-content-center">
          <Col xs={12} lg={8}>
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                <h5 className="mb-0">
                  <FaStore className="me-2 text-primary" />
                  Store Profile
                </h5>
                {!editing && (
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleEdit}
                      className="me-2"
                    >
                      <FaEdit className="me-1" /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={confirmDelete}
                    >
                      <FaTrash className="me-1" /> Delete
                    </Button>
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                {editing ? (
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                      <Form.Label>Store Name</Form.Label>
                      <Form.Control
                        type="text"
                        {...register('store_name', { required: 'Store name is required' })}
                        isInvalid={!!errors.store_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.store_name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        {...register('store_description')}
                      />
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label><FaEnvelope className="me-2" />Email</Form.Label>
                          <Form.Control
                            type="email"
                            {...register('contact_email', {
                              required: 'Email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                            isInvalid={!!errors.contact_email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.contact_email?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label><FaPhone className="me-2" />Phone</Form.Label>
                          <Form.Control
                            type="tel"
                            {...register('contact_phone')}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label><FaImage className="me-2" />Store Logo</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            {...register('store_logo')}
                            onChange={handleLogoChange}
                          />
                          {logoPreview && (
                            <div className="mt-2">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="img-thumbnail"
                                style={{ maxWidth: '150px' }}
                              />
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Store Status</Form.Label>
                          <div className="d-flex align-items-center gap-2">
                            <Button
                              onClick={async () => {
                                setLoading(true);
                                try {
                                  const action = store.is_active ? 'deactivate' : 'activate';
                                  const result = await Swal.fire({
                                    title: `Are you sure?`,
                                    text: `You are about to ${action} this store.`,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: `Yes, ${action} it!`
                                  });

                                  if (result.isConfirmed) {
                                    const updatedStore = await toggleStoreActiveStatus(
                                      store.id,
                                      !store.is_active
                                    );
                                    setStore(updatedStore);

                                    // Success notification
                                    await Swal.fire({
                                      title: 'Success!',
                                      text: `Store has been ${action}d.`,
                                      icon: 'success',
                                      timer: 2000,
                                      showConfirmButton: false
                                    });
                                  }
                                } catch (error) {
                                  console.error("Status update failed:", error);

                                  // Error notification
                                  await Swal.fire({
                                    title: 'Error!',
                                    text: 'Failed to update store status. Please try again.',
                                    icon: 'error'
                                  });
                                } finally {
                                  setLoading(false);
                                }
                              }}
                              disabled={loading}
                              className={`btn-sm ${store.is_active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            >
                              {loading ? (
                                <span className="spinner-border spinner-border-sm me-1" />
                              ) : store.is_active ? (
                                <FaPowerOff className="me-1" />
                              ) : (
                                <FaCheck className="me-1" />
                              )}
                              {store.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Badge bg={store.is_active ? "success" : "secondary"}>
                              {store.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <Form.Text className="text-muted">
                            {store.is_active
                              ? "This store is currently visible to customers"
                              : "This store is hidden from customers"}
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-end">
                      <Button
                        variant="outline-secondary"
                        onClick={handleCancel}
                        className="me-2"
                      >
                        <FaTimes className="me-1" /> Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            <span className="ms-2">Saving...</span>
                          </>
                        ) : (
                          <>
                            <FaSave className="me-1" /> Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <div className="store-header d-flex align-items-start mb-4 gap-3">
                      <div className="store-logo-container">
                        <img
                          src={store.store_logo || "/imgs/dummy-vendor.jpg"}
                          alt="Store Logo"
                          className="rounded"
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover',
                            border: '1px solid #eee'
                          }}
                        />
                      </div>

                      <div className="store-info flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h3 className="mb-0">{store.store_name}</h3>
                          <div className="badge-container d-flex gap-2">
                            <Badge bg={store.is_active ? "success" : "secondary"}>
                              {store.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge bg={store.is_verified ? "primary" : "secondary"}>
                              {store.is_verified ? "Verified" : "Unverified"}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-muted mb-2">{store.store_description}</p>

                        <div className="store-meta d-flex gap-3 text-muted small">
                          <span>
                            <FaCalendarAlt className="me-1" />
                            Joined {format(new Date(store.created_at), "MMMM d, yyyy")} ({store.days_since_created} days ago)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="store-contact card p-3 mb-4">
                      <h5 className="card-title mb-3">
                        <FaAddressCard className="me-2 text-primary" />
                        Contact Information
                      </h5>

                      <div className="contact-details">
                        <div className="d-flex align-items-center mb-2">
                          <FaEnvelope className="me-2 text-primary" />
                          <a href={`mailto:${store.contact_email}`}>{store.contact_email}</a>
                        </div>

                        {store.contact_phone && (
                          <div className="d-flex align-items-center">
                            <FaPhone className="me-2 text-primary" />
                            <a href={`tel:${store.contact_phone}`}>{store.contact_phone}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </Container>
  );
};

export default StoreProfile;