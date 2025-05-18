import React from 'react';
import { motion } from "framer-motion";
import { Container, Row, Col } from "react-bootstrap";
import { FaShoppingBag, FaTag } from "react-icons/fa";
function Hero() {
return (
    <section className="position-relative py-5" style={{ 
      minHeight: '80vh',
      overflow: 'hidden'
    }}>
      {/* Background Image */}
      <div className="position-absolute top-0 start-0 w-100 h-100">
        <img
          src="/imgs/hero-bg.jpg"
          alt="Happy shopping experience"
          className="w-100 h-100 object-cover"
          style={{ filter: 'brightness(0.7)' }}
        />
      </div>
      
      {/* Content Overlay */}
      {/* <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-30"></div> */}

      <Container className="position-relative z-1 h-100">
        <Row className="align-items-center min-vh-80">
          <Col lg={8} className="text-center text-lg-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="display-3 fw-bold mb-4 text-white">
                Discover Amazing Deals at <span className="text-yellow-400">VendorHub</span>
              </h1>
              <p className="lead text-white mb-4" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                Your one-stop destination for quality products at unbeatable prices. 
                Shop with confidence and enjoy fast delivery.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <motion.a
                  href="/products"
                  className="btn btn-yellow-600 text-white btn-lg px-4 py-3 shadow d-flex align-items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ backdropFilter: 'blur(2px)' }}
                >
                  <FaShoppingBag /> Shop Now
                </motion.a>
                <motion.a
                  href="/products/deals"
                  className="btn btn-outline-light btn-lg px-4 py-3 d-flex align-items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ backdropFilter: 'blur(2px)' }}
                >
                  <FaTag /> Today's Deals
                </motion.a>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* Decorative bottom border */}
      <div className="position-absolute bottom-0 start-0 w-100 h-1 bg-yellow-600"></div>

      <style>{`
        .min-vh-80 {
          min-height: 80vh;
        }
        .btn-yellow-600 {
          background-color: #d4a017;
          border-color: #d4a017;
        }
        .btn-yellow-600:hover {
          background-color: #b78a14;
          border-color: #b78a14;
        }
        .text-yellow-400 {
          color: #facc15;
        }
      `}</style>
    </section>
  );
}

export default Hero;
