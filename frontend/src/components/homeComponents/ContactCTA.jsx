import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const ContactCTA = () => {
  return (
    <section className="bg-white py-5" style={{ borderTop: '1px solid #f0f0f0' }}>
      <Container>
        <Row className="align-items-center g-5">
          <Col md={6} className="text-center text-md-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="display-5 fw-bold mb-4 text-dark">
                Have Questions? <span className="text-yellow-600">Contact Us</span>
              </h2>
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <FaEnvelope className="text-yellow-600" />
                  <span>support@vendorhub.com</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <FaPhoneAlt className="text-yellow-600" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <FaMapMarkerAlt className="text-yellow-600" />
                  <span>123 Business Ave, Suite 100</span>
                </div>
              </div>
              <motion.a
                href="/contact"
                className="btn btn-yellow-600 text-white px-4 py-3 shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get in Touch
              </motion.a>
            </motion.div>
          </Col>
          <Col md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/imgs/contact-hero.jpg"
                alt="Customer service team"
                className="img-fluid rounded-3 shadow-lg"
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactCTA;