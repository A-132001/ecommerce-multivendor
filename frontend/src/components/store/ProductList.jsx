import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Swal from 'sweetalert2';
import { FaExclamationTriangle, FaInfoCircle, FaFilter } from 'react-icons/fa';
import { getStoreProducts } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function ProductList({ storeId, selectedCategories, priceRange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await getStoreProducts(storeId);
        setProducts(response.data);
        setLoading(false);
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.detail || error.response.data.message || 'An error occurred.'
          : 'Error fetching products. Please try again later.';

        console.error('Error fetching products:', errorMessage);
        showErrorAlert('Error loading products', errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeId]);

  // Filter products based on selected categories and price range
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    return products.filter(product => {
      // Category filter
      const categoryMatch = selectedCategories.length === 0 || 
                           selectedCategories.includes(product.category_name);
      
      // Price filter
      const price = parseFloat(product.price);
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];
      
      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategories, priceRange]);

  const showErrorAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#d4a017',
      customClass: {
        popup: 'shadow-lg border border-gray-700'
      }
    });
  };

  const showInfoAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'info',
      background: '#0f172a',
      color: '#f8fafc',
      confirmButtonColor: '#d4a017',
      customClass: {
        popup: 'shadow-lg border border-gray-700'
      }
    });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Container
          className="d-flex flex-column justify-content-center align-items-center"
          style={{
            minHeight: '50vh',
            gap: '1rem'
          }}
        >
          <div className="d-flex align-items-center">
            <Spinner
              animation="grow"
              variant="warning"
              role="status"
              style={{ width: '3rem', height: '3rem' }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>

          <motion.span
            className="h5 text-muted"
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            Loading Vendor Products...
          </motion.span>

          <div className="w-50 mt-3">
            <div
              className="progress bg-warning bg-opacity-25"
              style={{ height: '4px' }}
            >
              <div
                className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
                style={{ width: '45%' }}
              />
            </div>
          </div>
        </Container>
      </motion.div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center max-w-md mx-auto mt-8">
        <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Products</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center max-w-md mx-auto mt-8">
        <FaInfoCircle className="text-yellow-500 text-3xl mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-white mb-2">No Products Available</h3>
        <p className="text-gray-400">This store currently has no products listed.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center max-w-md mx-auto mt-8">
        <FaFilter className="text-yellow-500 text-3xl mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-white mb-2">No Matching Products</h3>
        <p className="text-gray-400">
          No products match your selected filters. Try adjusting your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-dark mb-6">Available Products</h2>
      <Row className="row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {filteredProducts.map((product) => (
          <Col key={product.id} className="d-flex">
            <ProductCard product={product} className="h-100" />
          </Col>
        ))}
      </Row>
    </div>
  );
}