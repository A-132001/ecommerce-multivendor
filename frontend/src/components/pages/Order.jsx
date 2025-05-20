import React, { useState, useEffect } from "react";
import { createOrder, getCart } from "../../api/api.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const currency = useSelector((state) => state.currency.value);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shipping_address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: ""
    },
    billing_address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: ""
    },
    items: [],
    same_as_shipping: false
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getCart();
        if (response.data && response.data.items) {
          const formattedItems = response.data.items.map(item => ({
            product: item.product.id,
            vendor: item.product.vendor,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
            image: item.product.image
          }));

          setCartItems(formattedItems);
          const total = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          setSubtotal(total);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setErrorMessage("Failed to load cart items");
      }
    };

    fetchCartItems();
  }, []);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      same_as_shipping: checked,
      billing_address: checked ? prev.shipping_address : {
        street: "",
        city: "",
        state: "",
        postal_code: "",
        country: ""
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          product: item.product,
          vendor: item.vendor,
          quantity: item.quantity
        }))
      };

      const response = await createOrder(orderData);
      setSuccessMessage("Order created successfully! Proceed to payment.");
      
    } catch (error) {
      console.error("Order creation error:", error);
      const errorMsg = error.response?.data?.message ||
        error.response?.data?.detail ||
        "An error occurred while creating the order. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const addressFields = [
    { name: "street", label: "Street" },
    { name: "city", label: "City" },
    { name: "state", label: "State/Region" },
    { name: "postal_code", label: "Postal Code" },
    { name: "country", label: "Country" }
  ];

  return (
    <div className="container my-4 p-4">
      <div className="card shadow-sm border">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 fw-bold mb-1">Checkout</h2>
          <p className="small text-white-50 mb-0">Complete your purchase</p>
        </div>

        <form onSubmit={handleSubmit} className="card-body">
          <div className="mb-4 p-3 bg-light border rounded">
            <h3 className="h5 fw-semibold mb-3 border-bottom pb-2">Order Summary</h3>
            {cartItems.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered align-middle mb-0">
                  <thead className="table-light text-uppercase small">
                    <tr>
                      <th>Product</th>
                      <th style={{ width: "80px" }}>Quantity</th>
                      <th style={{ width: "100px" }}>Price</th>
                      <th style={{ width: "100px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image || "https://via.placeholder.com/80"}
                              alt={item.name}
                              className="img-thumbnail rounded"
                              style={{ width: "64px", height: "64px", objectFit: "cover" }}
                            />
                            <div className="ms-3">
                              <div className="fw-medium">{item.name}</div>
                              <div className="text-muted small">{item.vendor}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td>{currency} {item.price}</td>
                        <td className="fw-semibold">{currency} {item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end fw-semibold text-uppercase">Subtotal:</td>
                      <td className="fw-bold text-primary">{currency} {subtotal}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  fill="currentColor"
                  className="bi bi-cart"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1a1 1 0 0 1 1-1h1.5a.5.5 0 0 1 .485.379L3.89 4H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 13H4a.5.5 0 0 1-.491-.408L1.01 2H1a1 1 0 0 1-1-1zm4.415 11a1 1 0 1 0 1.17 1.37 1 1 0 0 0-1.17-1.37zm6.47 0a1 1 0 1 0 1.17 1.37 1 1 0 0 0-1.17-1.37z"/>
                </svg>
                <p className="mt-3">Your cart is empty</p>
              </div>
            )}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="p-3 bg-light border rounded h-100">
                <h3 className="h5 fw-semibold mb-3 border-bottom pb-2">Shipping Address</h3>
                {addressFields.map((field) => (
                  <div className="mb-3" key={field.name}>
                    <label htmlFor={`shipping_${field.name}`} className="form-label">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={`shipping_${field.name}`}
                      name={field.name}
                      value={formData.shipping_address[field.name]}
                      onChange={(e) => handleChange(e, "shipping_address")}
                      className="form-control"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-light border rounded h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                  <h3 className="h5 fw-semibold mb-0">Billing Address</h3>
                  <div className="form-check">
                    <input
                      id="same_as_shipping"
                      name="same_as_shipping"
                      type="checkbox"
                      checked={formData.same_as_shipping}
                      onChange={handleCheckboxChange}
                      className="form-check-input"
                    />
                    <label htmlFor="same_as_shipping" className="form-check-label">
                      Same as shipping
                    </label>
                  </div>
                </div>
                <div className="flex-grow-1">
                  {addressFields.map((field) => (
                    <div className="mb-3" key={field.name}>
                      <label htmlFor={`billing_${field.name}`} className="form-label">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        id={`billing_${field.name}`}
                        name={field.name}
                        value={formData.billing_address[field.name]}
                        onChange={(e) => handleChange(e, "billing_address")}
                        className="form-control"
                        required={!formData.same_as_shipping}
                        disabled={formData.same_as_shipping}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="h5 fw-semibold mb-3">Payment Method</h3>
            <div className="p-3 bg-light border rounded">
              <div className="form-check">
                <input
                  id="cash_on_delivery"
                  name="payment_method"
                  type="radio"
                  className="form-check-input"
                  defaultChecked
                />
                <label htmlFor="cash_on_delivery" className="form-check-label">
                  Cash on Delivery
                </label>
              </div>
              <div className="ps-4 mt-2 text-muted small">
                Pay with cash upon delivery
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            <div className="fs-5 fw-semibold">
              Total: <span className="text-primary">{currency} {subtotal}</span>
            </div>
            <button
              type="submit"
              disabled={isLoading || cartItems.length === 0}
              className={`btn btn-primary btn-lg ${isLoading || cartItems.length === 0 ? "disabled" : ""}`}
            >
              {isLoading ? (
                <span className="d-flex align-items-center">
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processing...
                </span>
              ) : (
                "Confirm Order"
              )}
            </button>
          </div>

          {successMessage && (
            <div className="alert alert-success mt-4" role="alert">
              <div className="d-flex align-items-center">
                <svg
                  className="bi flex-shrink-0 me-2"
                  width="24"
                  height="24"
                  fill="currentColor"
                  role="img"
                  aria-label="Success:"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <div>
                  <strong>Success!</strong> {successMessage}
                  <button
                    onClick={() => navigate('/payments')}
                    className="btn btn-primary mt-2 d-block"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger mt-4" role="alert">
              <div className="d-flex align-items-center">
                <svg
                  className="bi flex-shrink-0 me-2"
                  width="24"
                  height="24"
                  fill="currentColor"
                  role="img"
                  aria-label="Error:"
                >
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <div>
                  <strong>Error</strong> {errorMessage}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrderForm;