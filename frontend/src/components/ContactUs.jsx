import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import axios from 'axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('https://formspree.io/f/xqapdpkk', formData);
      setSubmitStatus({
        variant: 'success',
        message: 'Your message has been sent successfully! We will respond within 24 hours.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus({
        variant: 'danger',
        message: 'Failed to send message. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <FaEnvelope size={24} className="text-primary" />,
      title: 'Email Us',
      details: ['support@vendorhub.com', 'sales@vendorhub.com']
    },
    {
      icon: <FaPhone size={24} className="text-success" />,
      title: 'Call Us',
      details: ['+20 123 456 7890', '+20 987 654 3210']
    },
    {
      icon: <FaMapMarkerAlt size={24} className="text-warning" />,
      title: 'Visit Us',
      details: ['123 Nile Corniche, Cairo, Egypt']
    },
    {
      icon: <FaClock size={24} className="text-info" />,
      title: 'Working Hours',
      details: ['Sunday - Thursday: 9AM - 5PM', 'Friday - Saturday: Closed']
    }
  ];

  return (
    <Container className="py-5">
      <style>
        {`
          .accordion-button:not(.collapsed) {
            background-color: rgba(13, 110, 253, 0.1);
            color: #0d6efd;
          }
          .accordion-button:focus {
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          }
          .map-container {
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
        `}
      </style>
      
      <Row className="mb-5">
        <Col lg={6}>
          <h1 className="display-5 fw-bold mb-4">Get In Touch</h1>
          <p className="lead text-muted">
            Have questions or need assistance? Our team is ready to help you with
            any inquiries about our platform, vendor opportunities, or customer support.
          </p>
          
          <div className="mt-5">
            <h4 className="mb-4">Contact Information</h4>
            <Row className="g-4">
              {contactMethods.map((method, index) => (
                <Col md={6} key={index}>
                  <div className="d-flex align-items-start">
                    <div className="me-3 mt-1">{method.icon}</div>
                    <div>
                      <h5>{method.title}</h5>
                      {method.details.map((detail, i) => (
                        <p key={i} className="text-muted mb-1">{detail}</p>
                      ))}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        
        <Col lg={6}>
          <div className="bg-light p-4 rounded-3 shadow-sm">
            <h4 className="mb-4">Send Us a Message</h4>
            {submitStatus && (
              <Alert variant={submitStatus.variant} className="mt-3">
                {submitStatus.message}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="w-100 py-2"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </Form>
          </div>
          
          <div className="mt-4">
            <h5 className="mb-3">Frequently Asked Questions</h5>
            <div className="accordion" id="faqAccordion">
              <div className="accordion-item">
                <h6 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="false"
                    aria-controls="collapseOne"
                  >
                    How do I become a vendor?
                  </button>
                </h6>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingOne"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Visit our vendor registration page and complete the application form.
                    Our team will review your application within 2 business days.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h6 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    What payment methods do you accept?
                  </button>
                </h6>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    We accept <strong>Vodafone Cash</strong> and <strong>Online Card</strong> payments.
                    All payments are securely processed via Paymob.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col>
          <div className="ratio ratio-16x9 map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3452.769920282593!2d31.23594771511593!3d30.05907258187038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458409e8f2d3f1d%3A0x3f5a5f1a0e5b5f1e!2sCairo%2C%20Egypt!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              allowFullScreen=""
              loading="lazy"
              title="Our Location"
            ></iframe>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactUs;
