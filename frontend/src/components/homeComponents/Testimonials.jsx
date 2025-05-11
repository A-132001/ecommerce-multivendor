import { motion } from 'framer-motion';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "VendorHub has completely changed how I shop online. The selection is amazing and delivery is always prompt.",
      author: "Sarah Johnson",
      role: "Regular Customer",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      quote: "As a small business owner, VendorHub has helped me reach customers I never could have on my own.",
      author: "Michael Chen",
      role: "Vendor Partner",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];

  return (
    <section className="bg-light py-5">
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="display-5 fw-bold mb-5 text-center text-dark">
            What Our <span className="text-yellow-600">Customers Say</span>
          </h2>
        </motion.div>

        <Row className="g-4 justify-content-center">
          {testimonials.map((testimonial, index) => (
            <Col lg={6} key={index} className="d-flex align-items-stretch">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                  <Card.Body className="p-4">
                    <FaQuoteLeft className="text-yellow-600 mb-3" size={24} />
                    <blockquote className="mb-4">
                      <p className="lead fst-italic">"{testimonial.quote}"</p>
                    </blockquote>

                  </Card.Body>
<Card.Footer className="bg-white border-0 d-flex align-items-center">
  <div 
    className="rounded-circle me-3 d-flex align-items-center justify-content-center"
    style={{
      width: '50px',
      height: '50px',
      backgroundColor: '#f0f0f0',
      color: '#d4a017',
      fontSize: '20px',
      fontWeight: 'bold'
    }}
  >
    {testimonial.author.split(' ').map(name => name[0]).join('')}
  </div>
  <div>
    <h5 className="mb-0">{testimonial.author}</h5>
    <small className="text-muted">{testimonial.role}</small>
  </div>
</Card.Footer>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials;