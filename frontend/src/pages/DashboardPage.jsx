import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import AddProductForm from '../components/dashboard/AddProductForm';
import ProductManagementTable from '../components/dashboard/ProductManagementTable';
import OrdersList from '../components/dashboard/OrdersList';
import Swal from 'sweetalert2';
import { FaExclamationTriangle, FaInfoCircle, } from 'react-icons/fa';
import { createProduct, getStoreProducts, getProduct, updateProduct, deleteProduct,listOrders } from '../api/api';
import {motion, AnimatePresence} from 'framer-motion';
import { ImSpinner8 } from 'react-icons/im';
import { FaBox, FaShoppingBag, FaChartLine, FaPlus, FaChevronUp } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState([]);

  const addProduct = async (newProduct) => {
    try {
      const response = await createProduct(newProduct);
      if (response.status !== 201) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to add product',
          icon: 'error',
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#d4a017',
          customClass: {
            popup: 'shadow-lg border border-gray-700'
          }
        });

        const updatedProducts = [
          ...products,
          { id: products.length + 1, ...newProduct },
        ];
        setProducts(updatedProducts);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        return;
      }
    } catch (error) {
      let backendErrorMessage = "An error occurred while registering the vendor.";
      const errData = error?.response?.data;

      if (typeof errData === "string") {
        backendErrorMessage = errData;
      } else if (errData?.detail) {
        backendErrorMessage = errData.detail;
      } else if (errData?.message) {
        backendErrorMessage = errData.message;
      } else if (typeof errData === "object") {
        backendErrorMessage = Object.entries(errData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
          .join(" - ");

      }


      setError(backendErrorMessage);

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: backendErrorMessage,
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try{
      const response = deleteProduct(id);
      console.log('Delete product response:', response);
          const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);

    localStorage.setItem('products', JSON.stringify(updatedProducts));
    }catch {
      console.log('Error deleting product:', error);
      let backendErrorMessage = "An error occurred while deleting the product.";
      const errData = error?.response?.data;
      if (typeof errData === "string") {
        backendErrorMessage = errData;
      } else if (errData?.detail) {
        backendErrorMessage = errData.detail;
      } else if (errData?.message) {
        backendErrorMessage = errData.message;
      } else if (typeof errData === "object") {
        backendErrorMessage = Object.entries(errData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
          .join(" - ");
      }
      setError(backendErrorMessage);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: backendErrorMessage,
      });
    }

  };

  const handleEditProduct =async (id, updatedProduct) => {
    try {
      const response = await updateProduct(id, updatedProduct);
      console.log('Edit product response:', response);
      const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, ...updatedProduct } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    } catch (error) {
      let backendErrorMessage = "An error occurred while updating the product.";
      const errData = error?.response?.data;
      if (typeof errData === "string") {
        backendErrorMessage = errData;
      } else if (errData?.detail) {
        backendErrorMessage = errData.detail;
      } else if (errData?.message) {
        backendErrorMessage = errData.message;
      } else if (typeof errData === "object") {
        backendErrorMessage = Object.entries(errData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
          .join(" - ");
      }
      setError(backendErrorMessage);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: backendErrorMessage,
      });
      console.log('Error editing product:', error);  
    }
  };

  const deleteOrder = (id) => {
    const updatedOrders = orders.filter((order) => order.id !== id);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const editOrder = (id, updatedOrder) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, ...updatedOrder } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getStoreProducts();
        console.log('Fetched products:', response.data);
        setProducts(response.data);
        localStorage.setItem('products', JSON.stringify(response.data));
      } catch (error) {
        console.log('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await listOrders();
        setOrders(response.data);
        console.log('Fetched orders:', response.data);
        localStorage.setItem('orders', JSON.stringify(response.data));
      } catch (error) {
        let backendErrorMessage = "An error occurred while fetching orders.";
        const errData = error?.response?.data;
        if (typeof errData === "string") {
          backendErrorMessage = errData;
        }
        else if (errData?.detail) {
          backendErrorMessage = errData.detail;
        } else if (errData?.message) {
          backendErrorMessage = errData.message;
        } else if (typeof errData === "object") {
          backendErrorMessage = Object.entries(errData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join(" - ");
        }
        setError(backendErrorMessage);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: backendErrorMessage,
        });
        console.error('Error fetching orders:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // fetchOrders();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 bg-dark text-white p-4">
          <DashboardSidebar />
        </div>
        {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="warning" />
                <p className="mt-3">Loading shops...</p>
              </div>
        ) : error ? (
          <div className="col-md-9 p-4">
            <h2 className="mb-4">Error</h2>
            <p>{error}</p>
          </div>
        ):(
           <div className="col-md-9 p-4">
          <h2 className="mb-4">Dashboard</h2>
          <div className="mb-4">
            <AddProductForm addProduct={addProduct} />
          </div>
          <div className="mb-4">
            <ProductManagementTable products={products} onDelete={handleDeleteProduct} onEdit={handleEditProduct} />
          </div>
          <div>
            <OrdersList orders={orders} onDelete={deleteOrder} onEdit={editOrder} />
          </div>
        </div>)}
      </div>
    </div>
  );
}
