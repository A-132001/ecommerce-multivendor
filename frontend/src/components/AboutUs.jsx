import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaHandshake, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import teamImg from '../assets/team.jpg'; 

const AboutUs = () => {
  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '500+', label: 'Verified Vendors' },
    { value: '50,000+', label: 'Products Listed' },
    { value: '24/7', label: 'Customer Support' }
  ];

  const features = [
    {
      icon: <FaUsers size={40} className="text-primary mb-3" />,
      title: 'Diverse Community',
      description: 'Connecting buyers with trusted sellers across various industries'
    },
    {
      icon: <FaHandshake size={40} className="text-success mb-3" />,
      title: 'Secure Transactions',
      description: 'Escrow protection and secure payment processing'
    },
    {
      icon: <FaChartLine size={40} className="text-warning mb-3" />,
      title: 'Vendor Growth',
      description: 'Tools and analytics to help vendors expand their business'
    },
    {
      icon: <FaShieldAlt size={40} className="text-info mb-3" />,
      title: 'Buyer Protection',
      description: 'Money-back guarantee on all qualified purchases'
    }
  ];

  return (
    <Container className="py-5">
      <style>
        {`
          .timeline {
            position: relative;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 0;
          }
          .timeline::before {
            content: '';
            position: absolute;
            width: 2px;
            background-color: #e9ecef;
            top: 0;
            bottom: 0;
            left: 50%;
            margin-left: -1px;
          }
          .timeline-item {
            padding: 10px 40px;
            position: relative;
            width: 50%;
            box-sizing: border-box;
          }
          .timeline-item:nth-child(odd) { left: 0; }
          .timeline-item:nth-child(even) { left: 50%; }
          .timeline-content {
            padding: 20px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .timeline-item::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            background-color: #0d6efd;
            border-radius: 50%;
            top: 20px;
            z-index: 1;
          }
          .timeline-item:nth-child(odd)::after { right: -10px; }
          .timeline-item:nth-child(even)::after { left: -10px; }

          @media (max-width: 768px) {
            .timeline::before { left: 40px; }
            .timeline-item { width: 100%; padding-left: 70px; padding-right: 25px; left: 0 !important; }
            .timeline-item::after { left: 30px !important; right: auto !important; }
          }
        `}
      </style>

      {/* Hero Section */}
      <Row className="mb-5 align-items-center">
        <Col md={6}>
          <h1 className="display-4 fw-bold mb-4">About VendorHub</h1>
          <p className="lead text-muted">
            The leading marketplace connecting buyers with trusted vendors since 2018.
            Our platform empowers small businesses while providing customers with
            quality products and exceptional service.
          </p>
        </Col>
        <Col md={6}>
          <img 
            src={teamImg} 
            alt="VendorHub team" 
            className="img-fluid rounded shadow-lg" 
          />
        </Col>
      </Row>

      {/* Stats Section */}
      <Row className="g-4 mb-5 text-center">
        {stats.map((stat, index) => (
          <Col md={3} key={index}>
            <div className="p-4 bg-light rounded-3 shadow-sm">
              <h2 className="fw-bold text-primary">{stat.value}</h2>
              <p className="mb-0">{stat.label}</p>
            </div>
          </Col>
        ))}
      </Row>

      {/* Our Story */}
      <section className="mb-5">
        <h2 className="text-center mb-4">Our Story</h2>
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-content">
              <h5>2018 - Founded</h5>
              <p>
                Started as a small platform with 10 vendors in Cairo, Egypt.
                Our mission was to help local businesses reach wider audiences.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <h5>2020 - Expanded Services</h5>
              <p>
                Launched vendor analytics tools and mobile app to better serve
                our growing community of 500+ vendors.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <h5>2023 - Regional Growth</h5>
              <p>
                Expanded operations to serve the entire MENA region with
                localized support in Arabic, English and French.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-5">
        <h2 className="text-center mb-5">Why Choose VendorHub?</h2>
        <Row className="g-4">
          {features.map((feature, index) => (
            <Col md={3} key={index}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="text-center p-4">
                  {feature.icon}
                  <h5>{feature.title}</h5>
                  <p className="text-muted">{feature.description}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Team */}
      <section>
        <h2 className="text-center mb-4">Meet The Team</h2>
        <Row className="g-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Img variant="top" src="https://randomuser.me/api/portraits/men/32.jpg" />
              <Card.Body className="text-center">
                <h5>Ahmed Mohamed</h5>
                <p className="text-muted">CEO & Founder</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Img variant="top" src="data:image/jpeg;base64,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" />
              <Card.Body className="text-center">
                <h5>Fatima Al-Masri</h5>
                <p className="text-muted">COO</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Img variant="top" src="https://randomuser.me/api/portraits/men/75.jpg" />
              <Card.Body className="text-center">
                <h5>Omar Hassan</h5>
                <p className="text-muted">CTO</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default AboutUs;
