import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import Swal from 'sweetalert2';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import {getStoreProducts} from '../../api/api';
import { useNavigate } from 'react-router-dom';
export default function ProductList({ storeId }) {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getStoreProducts(storeId);

        setProducts(response.data);
        setLoading(false);
        if (response.data.length === 0) {
          showInfoAlert('No products found', 'This store currently has no products available');
        }
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
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
        <h3 className="text-xl font-semibold text-dark mb-2">No Products Available</h3>
        <p className="text-gray-400">This store currently has no products listed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Available Products</h2>
      <div className="d-flex flex-wrap gap-4 justify-center items-center mb-8 ">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}