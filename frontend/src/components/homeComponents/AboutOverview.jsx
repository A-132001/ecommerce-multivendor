import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { FaStore } from 'react-icons/fa';

const AboutOverview = () => {
  return (
    <section className="bg-light py-5">
      <Container>
        <Row className="align-items-center g-5">
          <Col md={6} className="order-md-2 text-center text-md-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="display-5 fw-bold mb-4 text-dark">
                About <span className="text-yellow-600">VendorHub</span>
              </h2>
              <p className="lead text-dark mb-4">
                Founded in 2023, VendorHub connects customers with trusted vendors offering quality products at competitive prices.
              </p>
              <p className="text-muted mb-4">
                Our platform brings together hundreds of independent sellers under one marketplace, ensuring you get the best selection with the convenience of one checkout.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-md-start">
                <motion.a
                  href="/about"
                  className="btn btn-yellow-600 text-white px-4 py-3 shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaStore className="me-2" /> Our Story
                </motion.a>
              </div>
            </motion.div>
          </Col>
          <Col md={6} className="order-md-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/imgs/about-hero.jpg"
                alt="Our team at work"
                className="img-fluid rounded-3 shadow-lg"
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutOverview;