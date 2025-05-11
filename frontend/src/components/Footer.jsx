import { Container, Row, Col } from 'react-bootstrap';
import { FaStore, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 border-t border-gray-700">
      <Container fluid>
        <Row className="g-4 px-3">
          {/* Brand Column */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center mb-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary 
            via-secondary to-accent flex items-center justify-center shadow-glow transition-shadow 
            duration-300 group-hover:shadow-glow-lg"
                  style={{ color: '#d4a017' }}
                >
                  <i className="fas fa-bolt text-2xl"></i>
                  <span className='mx-1'>VendorHub</span>
                </div>

              </div>
            </div>
            <p className="text-gray-400">
              Connecting buyers with trusted vendors since 2023. Your premier marketplace for quality products and services.
            </p>
            <div className="d-flex mt-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500 me-3 transition-colors duration-200"><FaFacebookF /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 me-3 transition-colors duration-200"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 me-3 transition-colors duration-200"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200"><FaLinkedinIn /></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h5 className="fw-bold mb-4 text-white">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">Home</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">Products</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">Vendors</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">Categories</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">Deals</a></li>
            </ul>
          </Col>

          {/* Support */}
          <Col lg={2} md={6}>
            <h5 className="fw-bold mb-4 text-white">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">Help Center</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">Contact Us</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">FAQs</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">Shipping</a></li>
              <li className="mb-2"><a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors duration-200">Returns</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={4} md={6}>
            <h5 className="fw-bold mb-4 text-white">Contact Us</h5>
            <ul className="list-unstyled text-gray-400">
              <li className="mb-3 d-flex">
                <FaMapMarkerAlt className="me-2 mt-1 text-yellow-500" />
                <span>Cairo, Egypt</span>
              </li>
              <li className="mb-3 d-flex">
                <FaEnvelope className="me-2 mt-1 text-yellow-500" />
                <span>support@vendorhub.com</span>
              </li>
              <li className="mb-3 d-flex">
                <FaPhone className="me-2 mt-1 text-yellow-500" />
                <span>(+20) 1009356321</span>
              </li>
            </ul>
          </Col>
        </Row>

        <hr className="my-4 border-gray-700" />

        {/* Copyright */}
        <Row className="pb-3 px-3">
          <Col md={6} className="text-center text-md-start">
            <small className="text-gray-500">
              © {new Date().getFullYear()} VendorHub.com. All rights reserved.
            </small>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <small>
              <a href="#" className="text-gray-500 hover:text-yellow-500 me-3 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-yellow-500 me-3 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-yellow-500 transition-colors duration-200">Sitemap</a>
            </small>
          </Col>
        </Row>
      </Container>

      <style>{`
        .text-yellow-500 {
          color: #d4a017 !important;
        }
        .hover\:text-yellow-500:hover {
          color: #d4a017 !important;
        }
        .border-t {
          border-top: 1px solid ;
        }
        a {
          text-decoration: none;
          color: gray !important;
          transition: color 0.2s ease-in-out;
        
        }
        a:hover {
          color: #d4a017 !important;
        }
      `}</style>
    </footer>
  );
}

export default Footer;