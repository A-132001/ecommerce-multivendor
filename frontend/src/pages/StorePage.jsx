import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Image,
  Form,
  ListGroup,
} from "react-bootstrap";
import { motion } from "framer-motion";
import ProductList from "../components/store/ProductList";
import { FaStore, FaInfoCircle, FaFilter } from "react-icons/fa";

export default function StorePage() {
  const { store_id } = useParams();
  const location = useLocation();
  const { shop } = location.state || {};
  const { store_name, store_description, store_logo } = shop || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([100, 1200]);

  // Categories list
  const categories = [
    "Sportswear",
    "Bags & Accessories",
    "Shoes",
    "Kids",
    "Women's Clothing",
    "Men's Clothing",
  ];

  // Add animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange([Math.min(value, priceRange[1]), value]);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="store-page py-5"
    >
      <Container>
        <Row>
          {/* Sidebar Filters */}
          <Col md={3} className="mb-4">
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <FaFilter className="text-warning me-2 fs-4" />
                    <Card.Title as="h3" className="mb-0 fs-5">
                      Filters
                    </Card.Title>
                  </div>

                  {/* Categories Filter */}
                  <div className="mb-4">
                    <h5 className="mb-3">Categories</h5>
                    <ListGroup variant="flush">
                      {categories.map((category) => (
                        <ListGroup.Item
                          key={category}
                          className="border-0 px-0"
                        >
                          <Form.Check
                            type="checkbox"
                            id={category}
                            label={category}
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                          />
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>

                  {/* Price Filter */}
                  <div className="mb-3">
                    <h5 className="mb-3">Price Range</h5>
                    <div className="d-flex justify-content-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                    <Form.Range
                      min={100}
                      max={1200}
                      step={50}
                      value={priceRange[1]}
                      onChange={handlePriceChange}
                    />
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Main Content */}
          <Col md={9}>
            {/* Store Header Section */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-sm mb-5">
                <Row className="g-0 align-items-center">
                  <Col md={3}>
                    <Image
                      src={
                        store_logo ||
                        "https://img.freepik.com/free-vector/online-shopping-concept-illustration_114360-1084.jpg"
                      }
                      alt={store_name}
                      fluid
                      className="rounded-start"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </Col>
                  <Col md={9}>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <FaStore className="text-warning me-2 fs-4" />
                        <Card.Title as="h1" className="mb-0 display-5 fw-bold">
                          {store_name || "Store Name"}
                        </Card.Title>
                      </div>
                      <Card.Text className="text-muted lead">
                        {store_description ||
                          "No description available for this store."}
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </motion.div>

            {/* Products Section */}
            <motion.div variants={itemVariants}>
              <h2 className="mb-4 display-6 fw-bold">Products</h2>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-3">Loading products...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <ProductList
                  storeId={store_id}
                  selectedCategories={selectedCategories}
                  priceRange={priceRange}
                />
              )}
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}
