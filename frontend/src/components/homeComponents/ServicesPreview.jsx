import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShippingFast, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const ServicesPreview = () => {
  const services = [
    {
      icon: <FaShippingFast size={32} className="text-yellow-600" />,
      title: "Fast Delivery",
      description: "Get your orders delivered quickly with our reliable shipping partners.",
      link: "/services/delivery"
    },
    {
      icon: <FaShieldAlt size={32} className="text-yellow-600" />,
      title: "Quality Guarantee",
      description: "All products are vetted to meet our quality standards.",
      link: "/services/quality"
    },
    {
      icon: <FaHeadset size={32} className="text-yellow-600" />,
      title: "24/7 Support",
      description: "Our customer service team is always ready to help.",
      link: "/services/support"
    }
  ];

  return (
<section className="bg-white py-5">
  <Container>
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="display-5 fw-bold mb-5 text-center text-dark">
        Our <span className="text-yellow-600">Services</span>
      </h2>
    </motion.div>

    <Row className="g-4">
      {services.map((service, index) => (
        <Col md={4} key={index} className="d-flex align-items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-100 border-0 shadow-sm rounded-3 overflow-hidden d-flex flex-column">
              <Card.Body className="p-4 text-center d-flex flex-column">
                <div className="mb-4">{service.icon}</div>
                <h3 className="h4 fw-bold mb-3">{service.title}</h3>
                <p className="text-muted mb-4">{service.description}</p>

                {/* Push button to bottom */}
                <motion.a
                  href={service.link}
                  className="btn btn-outline-yellow-600 mt-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn more
                </motion.a>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      ))}
    </Row>
  </Container>
</section>

  );
};

export default ServicesPreview;