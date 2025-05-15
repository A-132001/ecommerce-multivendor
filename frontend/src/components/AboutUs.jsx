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
              <Card.Img variant="top" src="https://randomuser.me/api/portraits/women/44.jpg" />
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
