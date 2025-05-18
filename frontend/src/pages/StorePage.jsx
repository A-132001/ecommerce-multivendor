import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Image } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ProductList from '../components/store/ProductList';
import { FaStore, FaInfoCircle } from 'react-icons/fa';
 
export default function StorePage() {
  const { store_id } = useParams();
  const location = useLocation();
  const { shop } = location.state || {};
  const { store_name, store_description, store_logo } = shop || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="store-page py-5"
    >
      <Container> 
        {/* Store Header Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-sm mb-5">
            <Row className="g-0 align-items-center">
              <Col md={3}>
                <Image
                  src={store_logo || 'https://img.freepik.com/free-vector/online-shopping-concept-illustration_114360-1084.jpg'}
                  alt={store_name}
                  fluid
                  className="rounded-start"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              </Col>
              <Col md={9}>
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaStore className="text-warning me-2 fs-4" />
                    <Card.Title as="h1" className="mb-0 display-5 fw-bold">
                      {store_name || 'Store Name'}
                    </Card.Title>
                  </div>
                  <Card.Text className="text-muted lead">
                    {store_description || 'No description available for this store.'}
                  </Card.Text>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* About Store Section */}
        <motion.div variants={itemVariants} className="mb-5">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <FaInfoCircle className="text-warning me-2 fs-4" />
                <Card.Title as="h2" className="mb-0 fs-3">
                  About the Store
                </Card.Title>
              </div>
              <Card.Text>
                {store_description || 'This store has not provided additional information.'}
              </Card.Text>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Products Section */}
        <motion.div variants={itemVariants}>
          <h2 className="mb-4 display-6 fw-bold">Products</h2>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
              <p className="mt-3">Loading products...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">
              {error}
            </Alert>
          ) : (
            <ProductList storeId={store_id} />
          )}
        </motion.div>
      </Container>
    </motion.div>
  );
}