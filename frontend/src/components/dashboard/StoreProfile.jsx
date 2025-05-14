import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { 
  FaStore, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaImage
} from 'react-icons/fa';
import { getStore, updateStore, deleteStore } from '../../api/api';

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
        const response = await getStore(1);
        setStore(response.data);
        setLogoPreview(response.data.logo);
        reset(response.data);
      } catch (err) {
        setError('Failed to load store data');
      } finally {
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
    setLogoPreview(store.logo);
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
      Object.keys(data).forEach(key => {
        if (key === 'logo' && data.logo[0]) {
          formData.append('logo', data.logo[0]);
        } else if (key !== 'logo') {
          formData.append(key, data[key]);
        }
      });

      const response = await updateStore(1, formData);
      setStore(response.data);
      setEditing(false);
      MySwal.fire({
        title: 'Success!',
        text: 'Store profile updated successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (err) {
      MySwal.fire({
        title: 'Error!',
        text: 'Failed to update store profile',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteStore(1);
      MySwal.fire({
        title: 'Deleted!',
        text: 'Store profile has been deleted',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        // Redirect or handle after deletion
      });
    } catch (err) {
      MySwal.fire({
        title: 'Error!',
        text: 'Failed to delete store profile',
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
    <Container>
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    </Container>
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
                        {...register('name', { required: 'Store name is required' })}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        {...register('description')}
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

                    <Form.Group className="mb-4">
                      <Form.Label><FaImage className="me-2" />Store Logo</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        {...register('logo')}
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
                    <div className="d-flex align-items-start mb-4">
                      {store.logo && (
                        <img 
                          src={store.logo} 
                          alt="Store Logo" 
                          className="rounded me-4" 
                          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <h3>{store.name}</h3>
                        <p className="text-muted">{store.description}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="mb-3">Contact Information</h5>
                      <p>
                        <FaEnvelope className="me-2 text-primary" />
                        <a href={`mailto:${store.contact_email}`}>{store.contact_email}</a>
                      </p>
                      {store.contact_phone && (
                        <p>
                          <FaPhone className="me-2 text-primary" />
                          <a href={`tel:${store.contact_phone}`}>{store.contact_phone}</a>
                        </p>
                      )}
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