import React from 'react';

const DashboardSidebar = () => {
  return (
    <div>
      <h3 className="text-warning">Admin Panel</h3>
      <ul className="list-unstyled">
        <li className="mb-3">
          <a href="/dashboard" className="text-white text-decoration-none">
            Dashboard
          </a>
        </li>
        <li className="mb-3">
          <a href="/products" className="text-white text-decoration-none">
            Products
          </a>
        </li>
        <li className="mb-3">
          <a href="/orders" className="text-white text-decoration-none">
            Orders
          </a>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
