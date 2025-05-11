import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Hero from '../Hero';
import ShopCard from '../ShopCard';
import { listStores } from '../../api/api';

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await listStores();
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setError(
          error.response
            ? error.response.data.detail || error.response.data.message || 'An error occurred.'
            : 'Error fetching stores. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="home-page">
      <Hero />
      
      <section id="stores" className="py-5 bg-light">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-center mb-5 display-5 fw-bold">All Active Vendors</h2>
            
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3">Loading shops...</p>
              </div>
            ) : error ? (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            ) : stores.length === 0 ? (
              <Alert variant="info" className="text-center">
                No shops available at the moment.
              </Alert>
            ) : (
              <Row xs={1} md={2} lg={3} className="g-4">
                {stores.map((shop, index) => (
                  <Col key={shop.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ShopCard shop={shop} />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            )}
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

export default Home;