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
              <svg width="36" height="36" viewBox="0 0 36 36" className="me-2">
                <path
                  d="M12 18C12 13 15 10 20 10C25 10 28 13 28 18C28 23 25 26 20 26C15 26 12 23 12 18M20 26V31M20 10V5M5 18H0M35 18H30"
                  stroke="url(#logoGradient)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d4a017" />
                    <stop offset="50%" stopColor="#ffd700" />
                    <stop offset="100%" stopColor="#d4a017" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="h4 mb-0 fw-bold text-white">VendorHub</span>
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