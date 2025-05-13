// OrderList.jsx
import React, { useEffect, useState } from "react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/orders/")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
      });
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>User ID:</strong> {order.user}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Tax:</strong> ${order.tax}</p>
            <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
            <p><strong>Paymob Order ID:</strong> {order.paymob_order_id || "N/A"}</p>
            <p><strong>Shipping Address:</strong></p>
            {order.shipping_address ? (
              <ul>
                <li><strong>Street:</strong> {order.shipping_address.street}</li>
                <li><strong>City:</strong> {order.shipping_address.city}</li>
                <li><strong>State:</strong> {order.shipping_address.state}</li>
                <li><strong>Postal Code:</strong> {order.shipping_address.postal_code}</li>
                <li><strong>Country:</strong> {order.shipping_address.country}</li>
              </ul>
            ) : (
              <p>No shipping address provided.</p>
            )}
            <p><strong>Billing Address:</strong></p>
            {order.billing_address ? (
              <ul>
                <li><strong>Street:</strong> {order.billing_address.street}</li>
                <li><strong>City:</strong> {order.billing_address.city}</li>
                <li><strong>State:</strong> {order.billing_address.state}</li>
                <li><strong>Postal Code:</strong> {order.billing_address.postal_code}</li>
                <li><strong>Country:</strong> {order.billing_address.country}</li>
              </ul>
            ) : (
              <p>No billing address provided.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderList;
