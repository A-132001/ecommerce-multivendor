import React from 'react';
import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";
import { FaShoppingBag, FaTag } from "react-icons/fa";
function Hero() {
  return (
  <section className="bg-white py-5" style={{ borderBottom: '1px solid #f0f0f0' }}>
      <Container>
        <Row className="align-items-center g-5">
          <Col md={6} className="text-center text-md-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="display-4 fw-bold mb-4 text-dark">
                Discover Amazing Deals at <span className="text-yellow-600">VendorHub</span>
              </h1>
              <p className="lead text-dark mb-4">
                Your one-stop destination for quality products at unbeatable prices. 
                Shop with confidence and enjoy fast delivery.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
                <motion.a
                  href="/products"
                  className="btn btn-yellow-600 text-white btn-lg px-4 py-3 shadow d-flex align-items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShoppingBag /> Shop Now
                </motion.a>
                <motion.a
                  href="/products/deals"
                  className="btn btn-outline-yellow-600 btn-lg px-4 py-3 d-flex align-items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTag /> Today's Deals
                </motion.a>
              </div>
            </motion.div>
          </Col>
          <Col md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Happy shopping experience"
                className="img-fluid rounded-3 shadow-lg"
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Hero;
