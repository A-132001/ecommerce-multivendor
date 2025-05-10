import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import AddProductForm from '../components/dashboard/AddProductForm';
import ProductManagementTable from '../components/dashboard/ProductManagementTable';
import OrdersList from '../components/dashboard/OrdersList';

export default function DashboardPage() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const addProduct = (newProduct) => {
    const updatedProducts = [
      ...products,
      { id: products.length + 1, ...newProduct },
    ];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts)); 
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts)); 
  };

  const editProduct = (id, updatedProduct) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, ...updatedProduct } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts)); 
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 bg-dark text-white p-4">
          <DashboardSidebar />
        </div>
        <div className="col-md-9 p-4">
          <h2 className="mb-4">Dashboard</h2>
          <div className="mb-4">
            <AddProductForm addProduct={addProduct} />
          </div>
          <div className="mb-4">
            <ProductManagementTable products={products} onDelete={deleteProduct} onEdit={editProduct} />
          </div>
          <div>
            <OrdersList orders={orders} onDelete={deleteOrder} onEdit={editOrder} />
          </div>
          <div>
            <h1>Dashboard</h1>
            <ul>
              <li><Link to="/products">View All Products</Link></li>
              <li><Link to="/product-management">Manage Products</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
