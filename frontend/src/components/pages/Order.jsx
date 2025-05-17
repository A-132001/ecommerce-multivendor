import React, { useState, useEffect } from "react";
import { createOrder, getCart } from "../../api/api.js";

const OrderForm = () => {
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

  const token = localStorage.getItem("token");

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
          
          // Calculate subtotal
          const total = formattedItems.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0);
          setSubtotal(total);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setErrorMessage("Failed to load cart items");
      }
    };

    fetchCartItems();
  }, [token]);

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
      setSuccessMessage("Order created successfully! We will contact you to confirm the details.");
      console.log("Order created:", response.data);
      
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
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 py-4 px-6">
          <h2 className="text-2xl font-bold text-white">Order Details</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Order Summary */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
            {cartItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Image</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Product Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Quantity</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Price</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="px-4 py-2">
                          <img
                            src={item.image || "https://via.placeholder.com/80"}
                            alt={item.name}
                            className="object-cover rounded-md"
                            style={{ width: "80px", height: "80px" }}
                          />
                        </td>
                        <td className="px-4 py-2 text-gray-800">{item.name}</td>
                        <td className="px-4 py-2 text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-2 text-gray-600">{item.price} SAR</td>
                        <td className="px-4 py-2 text-gray-800 font-medium">
                          {item.price * item.quantity} SAR
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td colSpan="4" className="px-4 py-2 text-right font-semibold text-gray-800">
                        Total:
                      </td>
                      <td className="px-4 py-2 text-gray-800 font-bold">{subtotal} SAR</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No items in cart</p>
            )}
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Address */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Shipping Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  {addressFields.map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor={`shipping_${field.name}`}>
                        {field.label}
                      </label>
                      <input
                        type="text"
                        id={`shipping_${field.name}`}
                        name={field.name}
                        value={formData.shipping_address[field.name]}
                        onChange={(e) => handleChange(e, "shipping_address")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Billing Address</h3>
                <div className="grid grid-cols-1 gap-4">
                  {addressFields.map((field) => (
                    <div key={field.name} className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor={`billing_${field.name}`}>
                        {field.label}
                      </label>
                      <input
                        type="text"
                        id={`billing_${field.name}`}
                        name={field.name}
                        value={formData.billing_address[field.name]}
                        onChange={(e) => handleChange(e, "billing_address")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!formData.same_as_shipping}
                        disabled={formData.same_as_shipping}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment and Submit */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center">
                <input
                  id="cash_on_delivery"
                  name="payment_method"
                  type="radio"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  defaultChecked
                />
                <label htmlFor="cash_on_delivery" className="ml-3 block text-sm font-medium text-gray-700">
                  Cash on Delivery
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || cartItems.length === 0}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  isLoading || cartItems.length === 0 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order...
                  </span>
                ) : "Confirm Order"}
              </button>
            </div>

            {successMessage && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {successMessage}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errorMessage}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;