import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
// aboutuspage-hero.jpg
const StoresHero = () => {
    return (
  <section
  className="hero-stores py-5 text-white"
  style={{
    backgroundImage: "url('/imgs/vendorlist-hero.jpg')", 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  }}
>
  <Container style={{ position: 'relative', zIndex: 1 }}>
    <Row className="align-items-center">
      <Col md={8} className="mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="display-4 fw-bold mb-4">Discover Our Vendors</h1>
          <p className="lead mb-4">
            Explore a diverse collection of trusted sellers offering quality products and services.
          </p>
        </motion.div>
      </Col>
    </Row>
  </Container>
</section>

    );
};

export default StoresHero;