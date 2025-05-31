import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Button,
} from "react-bootstrap";
import { motion } from "framer-motion";
import ProductList from "../components/store/ProductList";
import { FaStore, FaInfoCircle, FaFilter } from "react-icons/fa";
import { getStoreCategories, getStoreProducts } from "../api/api"; // Adjust the import path as necessary

export default function StorePage() {
  const { store_id } = useParams();
  const location = useLocation();
  const { shop } = location.state || {};
  const { store_name, store_description, store_logo } = shop || {};
  const [state, setState] = useState({
    loading: false,
    error: null,
    selectedCategories: [],
    priceRange: [0, 100],
    storeProducts: [],
    categories: [],
    tempMinPrice: 0, // Temporary state for min price input
    tempMaxPrice: 100, // Temporary state for max price input
  });

  // Debounce function for input changes
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Fetch data with optimistic updates
  useEffect(() => {
    const fetchData = async () => {
      // Optimistic update: Set initial state immediately
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const [categoriesRes, productsRes] = await Promise.all([
          getStoreCategories(store_id),
          getStoreProducts(store_id),
        ]);

        const categories = categoriesRes.data?.length > 0 
          ? categoriesRes.data.map((cat) => cat.name) 
          : [];
        
        let storeProducts = [];
        let priceRange = [0, 100];
        let tempMinPrice = 0;
        let tempMaxPrice = 100;
        if (productsRes.data?.length > 0) {
          storeProducts = productsRes.data;
          const prices = productsRes.data.map((p) => parseFloat(p.price));
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          priceRange = [minPrice, maxPrice];
          tempMinPrice = minPrice;
          tempMaxPrice = maxPrice;
        }

        // Batch state update to reduce re-renders
        setState((prev) => ({
          ...prev,
          loading: false,
          categories,
          storeProducts,
          priceRange,
          tempMinPrice,
          tempMaxPrice,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load data",
        }));
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [store_id]);

  // Memoized max price
  const currentMaxPrice = useMemo(() => state.priceRange[1], [state.priceRange]);

  // Handle min price input change
  const handleMinPriceChange = useCallback(
    debounce((value) => {
      setState((prev) => ({
        ...prev,
        tempMinPrice: Number(value) >= 0 ? Number(value) : prev.tempMinPrice,
      }));
    }, 200),
    []
  );

  // Handle max price input change
  const handleMaxPriceChange = useCallback(
    debounce((value) => {
      setState((prev) => ({
        ...prev,
        tempMaxPrice: Number(value) >= 0 ? Number(value) : prev.tempMaxPrice,
      }));
    }, 200),
    []
  );

  // Handle apply button click
  const handleApplyPrice = useCallback(() => {
    setState((prev) => {
      const min = Math.min(prev.tempMinPrice, prev.tempMaxPrice);
      const max = Math.max(prev.tempMinPrice, prev.tempMaxPrice);
      return {
        ...prev,
        priceRange: [min, max],
      };
    });
  }, []);

  // Handle category change with memoization
  const handleCategoryChange = useCallback((category) => {
    setState((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  }, []);

  // Animation variants
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

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="store-page py-5"
    >
      <Container fluid>
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
                    {state.loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : state.error ? (
                      <Alert variant="danger" className="py-1">
                        {state.error}
                      </Alert>
                    ) : (
                      <ListGroup variant="flush">
                        {state.categories.map((category) => (
                          <ListGroup.Item
                            key={category}
                            className="border-0 px-0"
                          >
                            <Form.Check
                              type="checkbox"
                              id={category}
                              label={category}
                              checked={state.selectedCategories.includes(category)}
                              onChange={() => handleCategoryChange(category)}
                            />
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </div>

                  {/* Price Filter */}
                  <div className="mb-3">
                    <h5 className="mb-3">Price Range</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <Form.Control
                        type="number"
                        placeholder="Min Price"
                        value={state.tempMinPrice}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        style={{ width: "48%" }}
                        min={0}
                      />
                      <Form.Control
                        type="number"
                        placeholder="Max Price"
                        value={state.tempMaxPrice}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        style={{ width: "48%" }}
                        min={0}
                      />
                    </div>
                    <Button
                      variant="warning"
                      onClick={handleApplyPrice}
                      className="w-100"
                    >
                      Apply
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>

          {/* Rest of the component remains the same */}
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
              {state.loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-3">Loading products...</p>
                </div>
              ) : state.error ? (
                <Alert variant="danger">{state.error}</Alert>
              ) : (
                <ProductList
                  storeId={store_id}
                  selectedCategories={state.selectedCategories}
                  priceRange={state.priceRange}
                />
              )}
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}