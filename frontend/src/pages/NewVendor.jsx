import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";




const NewVendor = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/register");
  };

  return (
    <div className="new-vendor-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-sm mb-5">
                <Card.Body>
                  <h2 className="text-center mb-4">Become a Vendor</h2>
                  <p className="text-center mb-4">
                    Join our platform and start selling your products to a wider audience. 
                    Fill out the form to get started!
                  </p>
                  <div className="text-center">
                    <Button variant="warning" onClick={handleButtonClick}>
                      Register Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
export default NewVendor;